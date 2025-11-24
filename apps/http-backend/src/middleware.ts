import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { SECRET } from "@repo/common/config";

export const middleAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Extract token: supports both "Bearer <token>" and "<token>"
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;
  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, SECRET) as any;
    //@ts-ignore
    req.userId = decoded.userId; // or req.userId if you declared it
    next();
  } catch (error) {
    console.log("error at middleware level", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};
