import  WebSocket, { WebSocketServer } from "ws";
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
  } catch(e) {
    console.log(e)
  }
  return null
}

wss.on("connection",   function connection(ws, request) {
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

  ws.on("message", async function message(data) {
    const parsedData = JSON.parse(data as unknown as string);

    if (parsedData.type == "join_room") {
      const user = users.find(x => x.ws == ws);
      if (!user) return;

      user.rooms.push(parsedData.roomId);
    }
    if (parsedData.type == "leave_room") {
      const user = users.find(x => x.ws == ws);
      if (!user) return;
      user.rooms = user.rooms.filter((x) => x == parsedData.roomId);
    }

    if (parsedData.type == "chat") {
      const roomId = parsedData.roomId;
      const message = parsedData.message;

      await prismaClient.chat.create({
        data: {
          roomId,
          message,
          userId
        }
      })

      users.forEach(user => {
        if (user.rooms.includes(roomId)) {
          user.ws.send(
            JSON.stringify({
              type: "chat",
              message: message,
              roomId,
            })
          );
        }
      });
    }
  });
});
