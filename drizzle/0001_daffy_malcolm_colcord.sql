CREATE TABLE "texts" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "texts_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"content" varchar NOT NULL,
	"context" varchar NOT NULL,
	"instructions" varchar NOT NULL,
	"author_id" integer
);
