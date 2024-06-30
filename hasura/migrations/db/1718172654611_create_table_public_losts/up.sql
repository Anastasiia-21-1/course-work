CREATE TABLE "public"."losts"
(
    "id"          uuid DEFAULT public.gen_random_uuid() NOT NULL,
    "title"       text,
    "description" text,
    "photo"       text,
    "time"        text,
    "location"    text,
    "user_id"     uuid,
    PRIMARY KEY ("id"),
    UNIQUE ("id"),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
