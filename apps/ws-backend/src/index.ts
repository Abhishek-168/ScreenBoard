import WebSocket, { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { SECRET } from "@repo/common/config";
import { prismaClient } from "@repo/db/datab";

interface User {
  ws: WebSocket;
  userId: string;
  rooms: string[];
}

const users: User[] = [];

const wss = new WebSocketServer({ port: 8080 });

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, SECRET);

    if (typeof decoded == "string") {
      return null;
    }

    if (!decoded || !(decoded as JwtPayload).userId) {
      return null;
    } else {
      return decoded.userId;
    }
  } catch (e) {
    console.log(e);
  }
  return null;
}

wss.on("connection", function connection(ws, request) {
  ws.on("error", console.error);

  const url = request.url;
  if (!url) return;

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";
  const userId = checkUser(token);

  if (!userId) {
    ws.close();
    return null;
  }
  const newUser: User = { ws, userId, rooms: [] };
  users.push(newUser);

  ws.on("close", () => {
    const idx = users.findIndex((u) => u.ws === ws);
    if (idx !== -1) users.splice(idx, 1);
  });

  ws.on("message", async function message(data) {
    const parsedData = JSON.parse(data as unknown as string);

    if (parsedData.type === "join_room") {
      const user = users.find((x) => x.ws == ws);
      if (!user) return;

      // avoid duplicate rooms
      if (!user.rooms.includes(parsedData.roomId)) {
        user.rooms.push(parsedData.roomId);
      }
    }

    if (parsedData.type === "leave_room") {
      const user = users.find((x) => x.ws == ws);
      if (!user) return;
      user.rooms = user.rooms.filter((x) => x == parsedData.roomId);
    }

    // === update-shape branch ===
    if (parsedData.type === "update-shape") {
      try {
        const roomId = parsedData.roomId;
        const message = parsedData.message; // may be string or object
        let fidValue = parsedData.fid != null ? String(parsedData.fid) : undefined;

        if (!fidValue) {
          // fallback id if client didn't send one
          fidValue = `${userId}-${Date.now()}`;
          console.warn("update-shape received without fid, generated fallback:", fidValue);
        }

        // store/broadcast as a string so clients can JSON.parse(mssg.message)
        const messageString = typeof message === "string" ? message : JSON.stringify(message);

        // Upsert: update if exists, otherwise create (defence-in-depth)
        await prismaClient.chat.upsert({
          where: { fid: fidValue },
          create: {
            roomId,
            message: messageString,
            userId, // from outer scope (set when connection established)
            fid: fidValue,
          },
          update: {
            message: messageString,
          },
        });

        // Broadcast the updated shape to all users in the room
        users.forEach((user) => {
          if (user.rooms.includes(roomId)) {
            user.ws.send(
              JSON.stringify({
                type: "update-shape", // clients already listen for "chat"
                message: messageString, // always a string now
                roomId,
              })
            );
          }
        });
      } catch (err) {
        console.error("Failed to upsert/update shape:", err);
        // Optionally, send an error back to the originating client
        ws.send(
          JSON.stringify({ type: "error", message: "Failed to update shape" })
        );
      }

      // handled, so return early
      return;
    }

    // === chat branch (create or update atomically) ===
    if (parsedData.type == "chat") {
      const roomId = parsedData.roomId;
      const message = parsedData.message;
      let fidValue = parsedData.fid != null ? String(parsedData.fid) : undefined;

      if (!fidValue) {
        // generate a fallback id if client didn't supply one (helps avoid null assertion)
        fidValue = `${userId}-${Date.now()}`;
        console.warn("chat received without fid, generated fallback:", fidValue);
      }

      const messageString = typeof message === "string" ? message : JSON.stringify(message);

      try {
        // Use upsert to avoid P2002 and be idempotent
        await prismaClient.chat.upsert({
          where: { fid: fidValue },
          create: {
            roomId,
            message: messageString,
            userId,
            fid: fidValue,
          },
          update: {
            message: messageString,
          },
        });
      } catch (err) {
        console.error("Failed upsert chat:", err);
        ws.send(JSON.stringify({ type: "error", message: "Failed to save chat" }));
        return;
      }

      // broadcast to room (always send stringified message)
      users.forEach((user) => {
        if (user.rooms.includes(roomId)) {
          user.ws.send(
            JSON.stringify({
              type: "chat",
              message: messageString,
              roomId,
            })
          );
        }
      });
    }
  });
});
