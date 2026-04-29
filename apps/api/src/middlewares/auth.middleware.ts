import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import { JWT_KEY } from "../config/env";
import { eq } from "drizzle-orm";
import { user } from "../models";
import db from "../config/db";

interface AuthRequest extends Request {
    user?: string
}

export const protect = (role: string) => async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.user
    if (!token) {
        return res.status(401).json({ message: "unauthorized access" })
    }
    jwt.verify(token, JWT_KEY, async (err: any, decode: any) => {
        if (err) {
            return res.status(401).json({ message: "invalid token" })
        }
        const [result] = await db.select().from(user).where(eq(user.id, decode.id))
        if (result && result.role === role) {
            req.user = decode.id
            next()
        } else {
            return res.status(401).json({ message: "admin only route" })
        }
    })
}