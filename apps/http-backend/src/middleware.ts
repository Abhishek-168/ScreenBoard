import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import { SECRET } from "@repo/common/config";


export const middleAuth = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, SECRET);
        //@ts-ignore
        req.user = decoded.user;
        return next();
    } catch (error) {
        console.log("error at middleware level", error);
        return res.status(401).json({ "message": "Invalid token" });
    }
}