import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { SECRET } from "@repo/common/config";
import {
  userSchema,
  signinSchema,
  createRoomSchema,
} from "@repo/pure-common/types";
import { middleAuth } from "./middleware";
import { prismaClient } from "@repo/db/datab";
import cors from "cors"

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true
}));
app.post("/signup", async (req: Request, res: Response) => {
  const parsedData = userSchema.safeParse(req.body);
  if (!parsedData.success) {
    console.log("Failed at Signup Zod level");
    return;
  }
  console.log("safe parse is : " + parsedData);
  const email = parsedData.data?.email || "";
  const password = parsedData.data?.password || "";
  const name = parsedData.data?.name || "";

  try {
    const user = await prismaClient.user.create({
      data: {
        email: parsedData.data?.email || "",
        password: parsedData.data?.password || "",
        name: parsedData.data?.name || "",
      },
    });
  } catch (error) {
    res.status(411).send(error);
  }
  if (!email || !password)
    res.status(400).json({
      message: "Username or Password is empty",
    });
  res.status(200).send(email);
});

app.post("/signin", async (req: Request, res: Response) => {
  const parsedData = signinSchema.safeParse(req.body);
  if (!parsedData.success) {
    console.log("Failed at Signin Zod level");
    return;
  }
  const { email, password } = parsedData.data;
  console.log("Email: " + email + "Password: " + password);

  const user = await prismaClient.user.findFirst({
    where: {
      email: email,
      password: password,
    },
  });
  if (!user) {
    console.log("user not found");
    return res.status(404).send({ error: "user not found in db" });
  }
  const userId = user.id;

  const token = jwt.sign({ userId: userId }, SECRET);
  console.log("Signin Successful");
  res.status(200).send(token);
});

app.post("/create-room", middleAuth, async (req, res) => {
  const safeParse = createRoomSchema.safeParse(req.body);
  if (!safeParse.success) {
    console.log("Failed at Create Room Zod level");
    return;
  }
  //@ts-ignore
  const userId = req.userId;
  console.log("userid is " + userId);
  try {
    const room = await prismaClient.room.create({
      data: {
        name: safeParse.data.name,
        adminId: userId,
      },
    });
    res.status(200).send({ roomId: room.id });
  } catch (error) {
    res.status(411).send({ errrror: error });
  }
});

app.get("/chat/:roomId", async (req, res) => {
  const roomId = Number(req.params.roomId);
  const allMessages = await prismaClient.chat.findMany({
    where: {
      roomId: roomId,
    },
    orderBy: {
      id: "desc",
    },
    take: 50,
  });
  res.json({
    allMessages,
  });
});

app.get("/room/:slug", async (req, res) => {
  const slug = req.params.slug;
  const room = await prismaClient.room.findFirst({
    where: {
      name: slug,
    },
  });
  res.json({
    room,
  });
});

app.listen(3001);
