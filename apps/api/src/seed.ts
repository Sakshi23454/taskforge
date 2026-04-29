import { eq } from "drizzle-orm"
import db from "./config/db"
import { user } from "./models"
import bcryptjs from "bcryptjs"
import dotenv from "dotenv"
dotenv.config()

const SEED_ADMIN_NAME = process.env.SEED_ADMIN_NAME as string
const SEED_ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL as string
const SEED_ADMIN_MOBILE = process.env.SEED_ADMIN_MOBILE as string
const SEED_ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD as string
const SEED_ADMIN_ROLE = process.env.SEED_ADMIN_ROLE as string

export const seedAdmin = async () => {
    try {
        const [result] = await db.select().from(user).where(eq(user.email, SEED_ADMIN_EMAIL))
        if (result) {
            console.log("admin aleady exist");
            process.exit()
        }
        const hashpass = await bcryptjs.hash(SEED_ADMIN_PASSWORD as string, 10)
        await db.insert(user).values({
            name: SEED_ADMIN_NAME,
            email: SEED_ADMIN_EMAIL,
            mobile: SEED_ADMIN_MOBILE,
            password: hashpass,
            role: SEED_ADMIN_ROLE
        })
        console.log("seed complete")
        process.exit()
    } catch (error) {
        console.log(error)
        process.exit()
    }
}

seedAdmin()