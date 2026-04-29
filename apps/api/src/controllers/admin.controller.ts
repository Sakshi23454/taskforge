import { CONVOSEND_FETCH_REQUEST, CONVOSEND_FETCH_RESPONSE, CREATE_TASK_REQUEST, CREATE_TASK_RESPONSE, DELETE_EMPLOYEE__REQUEST, DELETE_EMPLOYEE_RESPONSE, DELETE_TASK_REQUEST, DELETE_TASK_RESPONSE, FETCH_TASK_REQUEST, FETCH_TASK_RESPONSE, ME_REQUEST, ME_RESPONSE, READ_EMPLOYEE_REQUEST, READ_EMPLOYEE_RESPONSE, REGISTER_EMPLOYEE_REQUEST, REGISTER_EMPLOYEE_RESPONSE, RESTORE_EMPLOYEE__REQUEST, RESTORE_EMPLOYEE_RESPONSE, UPDATE_EMPLOYEE__REQUEST, UPDATE_EMPLOYEE_RESPONSE, UPDATE_PROFILE_REQUEST, UPDATE_PROFILE_RESPONSE, UPDATE_TASK_DETAILS_REQUEST, UPDATE_TASK_DETAILS_RESPONSE, UPDATE_TASK_REQUEST, UPDATE_TASK_RESPONSE } from "@repo/types"
import { Request, Response } from "express"
import db from "../config/db"
import { convo, task, user } from "../models"
import { eq, or } from "drizzle-orm"
import { adminProfileUpload, taskHeroUpload } from "../utils/upload"
import cloud from "../utils/cloud"
import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcryptjs from "bcryptjs";
import path from "path";
import { JWT_KEY } from "../config/env"
import { sendEmail } from "../utils/email"
import { registerTemplate } from "../email-templates/registerTemplate"

interface MulterRequest extends Request<any, {}, UPDATE_PROFILE_REQUEST> {
    file: Express.Multer.File
}

interface EmployeeMulterRequest extends Request<any, {}, REGISTER_EMPLOYEE_REQUEST> {
    file: Express.Multer.File
}

interface UpdateEmployeeMulterRequest extends Request<any, {}, UPDATE_EMPLOYEE__REQUEST> {
    file: Express.Multer.File
}

interface taskDetailsMulterRequest extends Request<any, {}, UPDATE_TASK_DETAILS_REQUEST> {
    file: Express.Multer.File
}

export const updateProfile = async (req: Request, res: Response<UPDATE_PROFILE_RESPONSE>) => {
    try {
        const mreq = req as MulterRequest
        adminProfileUpload(mreq, res, async (err) => {
            if (err) {
                return res.status(500).json({ message: "unable to upload profile" })
            }
            // console.log(req.file)
            const updateData: {
                name?: string,
                profilePic?: string,
                email?: string,
                mobile?: string,
            } = {}
            if (mreq.file) {
                const { secure_url } = await cloud.uploader.upload(mreq.file.path)
                updateData.profilePic = secure_url
            }
            const { id } = mreq.params
            const { name, email, mobile } = mreq.body
            if (name) updateData.name = name
            if (email) updateData.email = email
            if (mobile) updateData.mobile = mobile

            await db.update(user).set(updateData).where(eq(user.id, id))
            res.status(200).json({ message: "profile update success" })
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to update profile" })
    }
}


export const me = (req: Request<{}, {}, ME_REQUEST>, res: Response<ME_RESPONSE>) => {
    try {
        const userToken = req.cookies?.user
        if (!userToken) {
            return res.status(401).json({ message: "unauthorized access" })
        }
        jwt.verify(userToken, JWT_KEY, async (err: any, decode: any) => {
            if (err) {
                return res.status(401).json({ message: "invalid token" })
            }
            // console.log(decode)
            const [result] = await db.select().from(user).where(eq(user.id, decode.id))
            // console.log(result)
            if (!result) {
                return res.status(500).json({ message: "invalid id" })

            }
            res.status(200).json({
                message: "fetch detail success", result: {
                    id: result.id,
                    name: result.name,
                    email: result.email,
                    mobile: result.mobile,
                    role: result.role,
                    profilePic: result.profilePic as string,
                }
            })
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "error" })
    }
}


export const registerEmployee = async (req: Request, res: Response<REGISTER_EMPLOYEE_RESPONSE>) => {
    try {
        const mreq = req as EmployeeMulterRequest
        adminProfileUpload(mreq, res, async err => {
            if (err) {
                console.log(err)
                return res.status(500).json({ message: "unable to upload image" })
            }
            const { email, mobile } = mreq.body
            const result = await db.select().from(user).where(or(eq(user.email, email), eq(user.mobile, mobile)))
            if (result.length > 0) {
                return res.status(400).json({ message: "email or mobile already exist" })
            }
            if (!mreq.file) {
                return res.status(400).json({ message: "profile image is required" })
            }
            const { secure_url } = await cloud.uploader.upload(mreq.file.path)
            const pass = crypto.randomBytes(10).toString("hex")
            const hash = await bcryptjs.hash(pass, 10)
            await sendEmail({
                email,
                subject: "Taskforge Registration",
                message: registerTemplate({ name: mreq.body.name, password: pass })
            })
            await db.insert(user).values({
                ...mreq.body,
                doj: new Date(mreq.body.doj),
                dob: new Date(mreq.body.dob),
                role: "employee",
                password: hash,
                profilePic: secure_url
            })
            return res.status(201).json({ message: "employee register success" })
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to register employee" })
    }
}


export const readEmployee = async (req: Request<{}, {}, READ_EMPLOYEE_REQUEST>, res: Response<READ_EMPLOYEE_RESPONSE>) => {
    try {
        const result = await db.select().from(user).where(eq(user.role, "employee"))
        res.status(200).json({ message: "read employee success", result })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to fetch employee" })
    }
}


export const deleteEmployee = async (req: Request<{ eid: number }, {}, DELETE_EMPLOYEE__REQUEST>, res: Response<DELETE_EMPLOYEE_RESPONSE>) => {
    try {
        const { eid } = req.params
        await db.update(user).set({ isDelete: true }).where(eq(user.id, eid))
        res.status(200).json({ message: "delete employee success" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to delete employee" })
    }
}

export const restoreEmployee = async (req: Request<{ eid: number }, {}, RESTORE_EMPLOYEE__REQUEST>, res: Response<RESTORE_EMPLOYEE_RESPONSE>) => {
    try {
        const { eid } = req.params
        await db.update(user).set({ isDelete: false }).where(eq(user.id, eid))
        res.status(200).json({ message: "restore employee success" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to restore employee" })
    }
}

export const updateEmployee = async (req: Request<{ eid: number }, {}, UPDATE_EMPLOYEE__REQUEST>, res: Response<UPDATE_EMPLOYEE_RESPONSE>) => {
    try {
        const mreq = req as UpdateEmployeeMulterRequest
        adminProfileUpload(mreq, res, async err => {
            if (err) {
                return res.status(400).json({ message: "unable to upload image" })
            }
            const { eid } = mreq.params
            const [result] = await db.select().from(user).where(eq(user.id, eid))
            if (!result) {
                return res.status(400).json({ message: "invalid user id" })
            }
            if (result.profilePic) {
                const p = path.basename(result.profilePic as string).split(".")[0]
                await cloud.uploader.destroy(p as string)

            }
            let imageURL
            if (mreq.file) {
                const { secure_url } = await cloud.uploader.upload(mreq.file.path)
                imageURL = secure_url
            }
            await db.update(user).set({
                ...mreq.body,
                doj: new Date(mreq.body.doj),
                dob: new Date(mreq.body.dob),
                profilePic: imageURL
            }).where(eq(user.id, eid))
            res.status(200).json({ message: "update employee success" })
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to update employee" })
    }
}


export const createTask = async (req: Request<{}, {}, CREATE_TASK_REQUEST>, res: Response<CREATE_TASK_RESPONSE>) => {
    try {
        const { title, userId } = req.body
        await db.insert(task).values({ title, userId })
        res.status(201).json({ message: "task create success" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to create task" })
    }
}

export const fetchTask = async (req: Request<{}, {}, FETCH_TASK_REQUEST>, res: Response<FETCH_TASK_RESPONSE>) => {
    try {
        const result = await db.select().from(task)
        res.status(200).json({ message: "task fetch success", result })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to fetch task" })
    }
}

export const updateTask = async (req: Request<{}, {}, UPDATE_TASK_REQUEST>, res: Response<UPDATE_TASK_RESPONSE>) => {
    try {
        const { taskId, userId } = req.body
        await db.update(task).set({ userId }).where(eq(task.id, taskId))
        res.status(200).json({ message: "task update success" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to update task" })
    }
}


// query res req
export const updateTaskDetails = async (req: Request<{ tid: number }, {}, UPDATE_TASK_DETAILS_REQUEST>, res: Response<UPDATE_TASK_DETAILS_RESPONSE>) => {
    try {
        const mreq = req as taskDetailsMulterRequest
        taskHeroUpload(mreq, res, async err => {
            if (err) {
                res.status(400).json({ message: "unable to upload image" })
            }
            const obj: { title?: string, desc?: string, due?: Date, hero?: string } = {}
            const { title, desc, due } = mreq.body

            if (title) obj.title = title
            if (desc) obj.desc = desc
            if (due) obj.due = new Date(due)
            if (mreq.file) {
                const { secure_url } = await cloud.uploader.upload(mreq.file.path)
                obj.hero = secure_url
            }
            await db.update(task).set(obj).where(eq(task.id, mreq.params.tid))
            res.status(200).json({ message: "task detail update success" })
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to update task deatil" })
    }
}

export const deleteTask = async (req: Request<{ tid: number }, {}, DELETE_TASK_REQUEST>, res: Response<DELETE_TASK_RESPONSE>) => {
    try {
        const { tid } = req.params
        await db.delete(task).where(eq(task.id, tid))
        res.status(200).json({ message: "task delete success" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to delete task" })
    }
}

export const convoFetchlogic = async (req: Request<{}, {}, CONVOSEND_FETCH_REQUEST>, res: Response<CONVOSEND_FETCH_RESPONSE>) => {
    try {
        const result = await db.select(
            {
                msg: convo.msg,
                userId: convo.userId,
                taskId: convo.taskId,
                name: user.name,
                profilePic: user.profilePic
            }
        )
            .from(convo)
            .leftJoin(user, eq(convo.userId, user.id))
        res.status(200).json({
            message: " Convo fetch success", result
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to fetch Convo" })
    }
}