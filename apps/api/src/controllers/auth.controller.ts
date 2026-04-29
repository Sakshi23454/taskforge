import { LOGIN_REQUEST, LOGIN_RESPONSE, LOGOUT_REQUEST, LOGOUT_RESPONSE, ME_REQUEST, ME_RESPONSE } from "@repo/types";
import { Request, Response } from "express";
import db from "../config/db";
import { user } from "../models";
import { eq } from "drizzle-orm";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { COOKIE_NAME, JWT_KEY, NODE_ENV, PRODUCTION } from "../config/env";

// {} - params, request, type
export const login = async (req: Request<{}, {}, LOGIN_REQUEST>, res: Response<LOGIN_RESPONSE>) => {
    try {
        const { email, password } = req.body
        const [result] = await db.select().from(user).where(eq(user.email, email))
        // console.log(result) {}
        if (!result) {
            return res.status(401).json({ message: "invalid credentials" })
        }
        const verify = await bcryptjs.compare(password, result.password)
        if (!verify) {
            return res.status(401).json({ message: "invalid credentials" })
        }
        if (!result.isActive) {
            return res.status(401).json({ message: "account blocked by admin" })
        }
        const token = jwt.sign({ id: result.id }, JWT_KEY, { expiresIn: "1d" })
        res.cookie(COOKIE_NAME, token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24,
            secure: NODE_ENV === PRODUCTION
        })
        res.status(200).json({
            message: "login success", result: {
                id: result.id,
                email: result.email,
                mobile: result.mobile,
                name: result.name,
                role: result.role
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to login server error" })
    }
}

export const logout = (req: Request<{}, {}, LOGOUT_REQUEST>, res: Response<LOGOUT_RESPONSE>) => {
    try {
        res.clearCookie(COOKIE_NAME)
        res.status(200).json({ message: "logout success" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to logout server error" })
    }
}

