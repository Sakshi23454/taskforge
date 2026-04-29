import { boolean, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const user = pgTable("users", {
    id: serial().primaryKey(),
    name: text().notNull(),
    email: text().notNull().unique(),
    mobile: text().notNull().unique(),
    password: text().notNull(),
    role: text().notNull().default("employee"),
    isActive: boolean().notNull().default(true),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().defaultNow(),

    // model change - drizzle generate, push
    // npm i cloudinary multer -w apps/api (working space)
    // npm i -D @types/multer -w apps/api
    profilePic: text(),

    department: text(),
    jobRole: text(),
    doj: timestamp(),
    dob: timestamp(),

    isDelete: boolean().default(false),
})