import { Pool } from "pg";
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres"
dotenv.config()

const pool = new Pool({ connectionString: process.env.PG_URL })
export default drizzle(pool)