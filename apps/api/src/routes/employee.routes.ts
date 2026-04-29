import { Router } from "express"
import {  convoSendlogic, getTasks } from "../controllers/employee.controller"

const router = Router()

router
    .get("/tasks", getTasks)
    .post("/convoSend",  convoSendlogic)

export default router