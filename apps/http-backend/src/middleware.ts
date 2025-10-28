import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import { SECRET } from "@repo/common/config";


export const middleAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["authorization"] || "";

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, SECRET);
        //@ts-ignore
        req.userId = decoded.userId;
        return next();
    } catch (error) {
        console.log("error at middleware level", error);
        return res.status(401).json({ "message": "Invalid token" });
    }
}