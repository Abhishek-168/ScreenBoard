import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { SECRET } from "@repo/common/config";
import {
  userSchema,
  signinSchema,
  createRoomSchema,
} from "@repo/pure-common/types";
import { middleAuth } from "./middleware";

const app = express();
app.use(express.json());

app.post("/signup", (req: Request, res: Response) => {
  const safeParse = userSchema.parse(req.body);
  if (!safeParse) {
    console.log("Failed at Signin Zod level");
    return;
  }
  const { username, password } = safeParse;
  if (!username || !password)
    res.status(400).json({
      message: "Username or Password is empty",
    });
  res.status(200).send(username);
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
