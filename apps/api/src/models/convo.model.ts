import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user.model";
import { task } from "./task.model";

export const convo = pgTable("convo", {
    id: serial().primaryKey(),
    msg: text(),
    userId: integer("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    taskId: integer("task_id").notNull().references(() => task.id, { onDelete: "cascade" }),
})