CREATE TABLE "public"."users"
(
    "id"            uuid DEFAULT public.gen_random_uuid() NOT NULL,
    "name"          text,
    "emailVerified" timestamptz,
    "image"         text,
    "first_name"    text                                  NOT NULL DEFAULT 'User',
    "last_name"     Text                                  NOT NULL DEFAULT 'User',
    "email"         text                                  NOT NULL,
    PRIMARY KEY ("id"),
    UNIQUE ("id"),
    UNIQUE ("email")
);
COMMENT
    ON TABLE "public"."users" IS E'Users table';
