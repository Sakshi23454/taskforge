import express from "express"
import cors from "cors"
import authRoutes from "./routes/auth.routes"
import adminRoutes from "./routes/admin.routes"
import employeeRoutes from "./routes/employee.routes"
import { FRONTEND_URL, NODE_ENV, PRODUCTION } from "./config/env"
import cookieParser from "cookie-parser"
import { protect } from "./middlewares/auth.middleware"
const app = express()
app.use(cookieParser())
app.use(cors({
    origin: FRONTEND_URL,
    credentials: true
}
))
app.use(express.json())
app.use("/api/auth", authRoutes)
app.use("/api/admin", protect("admin"), adminRoutes)
app.use("/api/employee", protect("employee"), employeeRoutes)
app.get("/", (req, res) => {
    res.json({ message: "API running successfully" })
})
const PORT = 5000

if(NODE_ENV !== PRODUCTION){
    app.listen(PORT, () => { console.log(`Server running on port ${PORT}`) })
}

export default app