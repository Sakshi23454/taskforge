import dotenv from "dotenv"
import { Config } from "drizzle-kit"
dotenv.config()
export default {
    dialect: "postgresql",
    schema: "./src/models/index.ts",
    out: "./drizzle",
    dbCredentials: { url: process.env.PG_URL as string },
} satisfies Config

// npm audit fix --force