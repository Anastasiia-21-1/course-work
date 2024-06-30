CREATE TABLE "public"."category"
(
    "name" text   NOT NULL,
    "icon" text,
    "id"   serial NOT NULL,
    PRIMARY KEY ("id"),
    UNIQUE ("name"),
    UNIQUE ("id")
);
COMMENT ON TABLE "public"."category" IS E'Category of found';
