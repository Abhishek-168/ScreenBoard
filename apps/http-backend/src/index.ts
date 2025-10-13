import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { SECRET } from "@repo/common/config";
import {
  userSchema,
  signinSchema,
  createRoomSchema,
} from "@repo/pure-common/types";
import { middleAuth } from "./middleware";
import {prismaClient} from "@repo/db/datab"

const app = express();
app.use(express.json());

app.post("/signup", async (req: Request, res: Response) => {
  const parsedData = userSchema.safeParse(req.body);
  if (!parsedData.success) {
    console.log("Failed at Signin Zod level");
    return;
  }
  console.log("safe parse is : " + parsedData)
  const email = parsedData.data?.email || ""
  const password = parsedData.data?.password || ""
  const name = parsedData.data?.name || ""

  const user = await prismaClient.user.create({
    data: {
      email: parsedData.data?.email || "",
      password: parsedData.data?.password || "",
      name: parsedData.data?.name || "",
    }
  })
  if (!email || !password)
    res.status(400).json({
      message: "Username or Password is empty",
    });
  res.status(200).send(email);
});

app.post("/signin", middleAuth, (req: Request, res: Response) => {
  const safeParse = signinSchema.parse(req.body);
  if (!safeParse) {
    console.log("Failed at Signin Zod level");
    return;
  }
  const { username, password } = safeParse;
  const token = jwt.sign(username + password, SECRET);
  console.log("Signin Successful");
  res.status(200).send(token);
});

app.post("/create-room", middleAuth, (req, res) => {
  const safeParse = createRoomSchema.parse(req.body);
  if (!safeParse) {
    console.log("Failed at Create Room Zod level");
    return;
  }
});

app.listen(3001);
