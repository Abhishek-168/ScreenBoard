import http from "http";
import WebSocket, { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prismaClient } from "@repo/db/datab";

interface User {
  ws: WebSocket;
  userId: string;
  rooms: string[];
}
const SECRET = process.env.JWT_SECRET || "default-secret";

const users: User[] = [];

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('OK');
  } else {
    res.writeHead(404);
    res.end();
  }
});

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

   
      if (!user.rooms.includes(parsedData.roomId)) {
        user.rooms.push(parsedData.roomId);
      }
    }

    if (parsedData.type === "leave_room") {
      const user = users.find((x) => x.ws == ws);
      if (!user) return;
      user.rooms = user.rooms.filter((x) => x == parsedData.roomId);
    }

   
    if (parsedData.type === "update-shape") {
      try {
        const roomId = parsedData.roomId;
        const message = parsedData.message; 
        let fidValue = parsedData.fid != null ? String(parsedData.fid) : undefined;

        if (!fidValue) {
         
          fidValue = `${userId}-${Date.now()}`;
          console.warn("update-shape received without fid, generated fallback:", fidValue);
        }

        
        const messageString = typeof message === "string" ? message : JSON.stringify(message);

        
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

       
        users.forEach((user) => {
          if (user.rooms.includes(roomId)) {
            user.ws.send(
              JSON.stringify({
                type: "update-shape", 
                message: messageString, 
                roomId,
              })
            );
          }
        });
      } catch (err) {
        console.error("Failed to upsert/update shape:", err);
        
        ws.send(
          JSON.stringify({ type: "error", message: "Failed to update shape" })
        );
      }

   
      return;
    }

    
    if (parsedData.type == "chat") {
      const roomId = parsedData.roomId;
      const message = parsedData.message;
      let fidValue = parsedData.fid != null ? String(parsedData.fid) : undefined;

      if (!fidValue) {
      
        fidValue = `${userId}-${Date.now()}`;
        console.warn("chat received without fid, generated fallback:", fidValue);
      }

      const messageString = typeof message === "string" ? message : JSON.stringify(message);

      try {
       
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
