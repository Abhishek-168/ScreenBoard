import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import {
  userSchema,
  signinSchema,
  createRoomSchema,
} from "@repo/pure-common/types";
import { middleAuth } from "./middleware";
import { prismaClient } from "@repo/db/datab";
import cors from "cors";

const SECRET = process.env.JWT_SECRET || "default-secret";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://screenboard-gray.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.post("/signup", async (req: Request, res: Response) => {
  const parsedData = userSchema.safeParse(req.body);
  if (!parsedData.success) {
    console.log("Failed at Signup Zod level");
    return;
  }
  console.log("safe parse is : ", parsedData);
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
    const userId = user.id;

    const token = jwt.sign({ userId: userId }, SECRET);
    console.log("Signup Successful");
    res.status(200).send(token);
  } catch (error) {
    res.status(411).send(error);
  }
  if (!email || !password)
    res.status(400).json({
      message: "Username or Password is empty",
    });
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

app.get("/allrooms", async (req, res) => {
  try {
    const allrooms = await prismaClient.room.findMany();
    res.json({ allrooms });
  } catch (err) {
    console.error('DB error fetching allrooms:', err);
    res.status(500).json({ error: 'Database error', details: err instanceof Error ? err.message : String(err) });
  }
});

app.get("/your-rooms", middleAuth, async (req, res) => {
  //@ts-ignore
  const userId = req.userId;  
  try {
    const yourrooms = await prismaClient.room.findMany({
      where: {
        adminId: userId,
      },
    });
    res.json(yourrooms);
  }
  catch (err) {
    console.error('DB error fetching yourrooms:', err);
    res.status(500).json(err);
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
    take: 500,
  });
  res.json({
    allMessages,
  });
});

app.get("/room/:slug", async (req, res) => {
  const slug = req.params.slug;
  const room = await prismaClient.room.findMany({
    where: {
      OR: [
        {
          name: {
            contains: slug,
            mode: 'insensitive',
          },
        },
        {
          id: slug && !isNaN(Number(slug)) ? Number(slug) : undefined,
        },
      ],
    },
  });
  console.log("Sending room data from BE");
  console.log("data from be " , room);
  res.json(room);
});

app.get('/healthz', (req, res) => {
    res.status(200).send('OK');
});


app.listen(process.env.PORT || 8000);