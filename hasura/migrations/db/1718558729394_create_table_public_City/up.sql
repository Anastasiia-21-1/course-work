CREATE TABLE "public"."City" ("id" serial NOT NULL, "name" text NOT NULL, PRIMARY KEY ("id") , UNIQUE ("name"));COMMENT ON TABLE "public"."City" IS E'Cities for founds';
