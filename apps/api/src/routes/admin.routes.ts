import { Router } from "express"
import { convoFetchlogic, createTask, deleteEmployee, deleteTask, fetchTask, me, readEmployee, registerEmployee, restoreEmployee, updateEmployee, updateProfile, updateTask, updateTaskDetails } from "../controllers/admin.controller"
const router = Router()

router
    .put("/update-profile/:id", updateProfile)
    .get("/me", me)
    .post("/employee-register", registerEmployee)
    .get("/employee", readEmployee)
    .delete("/employee-delete/:eid", deleteEmployee)
    .post("/employee-restore/:eid", restoreEmployee)
    .put("/employee-update/:eid", updateEmployee)
    .post("/task-create", createTask)
    .get("/task-fetch", fetchTask)
    .post("/task-update", updateTask)
    .put("/task-details-update/:tid", updateTaskDetails)
    .delete("/task-delete/:tid", deleteTask)
    .get("/convoFetch",  convoFetchlogic)

export default router