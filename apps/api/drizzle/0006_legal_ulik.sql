CREATE TABLE "convo" (
	"id" serial PRIMARY KEY NOT NULL,
	"msg" text,
	"user_id" integer NOT NULL,
	"task_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "convo" ADD CONSTRAINT "convo_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "convo" ADD CONSTRAINT "convo_task_id_task_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."task"("id") ON DELETE cascade ON UPDATE no action;