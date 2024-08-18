SET check_function_bodies = false;
CREATE FUNCTION public.set_current_timestamp_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$;
CREATE TABLE public."City" (
    id integer NOT NULL,
    name text NOT NULL
);
COMMENT ON TABLE public."City" IS 'Cities for founds';
CREATE SEQUENCE public."City_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public."City_id_seq" OWNED BY public."City".id;
CREATE TABLE public.accounts (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    type text NOT NULL,
    provider text NOT NULL,
    "providerAccountId" text NOT NULL,
    refresh_token text,
    access_token text,
    expires_at bigint,
    token_type text,
    scope text,
    id_token text,
    session_state text,
    oauth_token_secret text,
    oauth_token text,
    "userId" uuid NOT NULL,
    refresh_token_expires_in integer
);
CREATE TABLE public.category (
    name text NOT NULL,
    icon text,
    id integer NOT NULL
);
COMMENT ON TABLE public.category IS 'Category of found';
CREATE SEQUENCE public.category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.category_id_seq OWNED BY public.category.id;
CREATE TABLE public.finds (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    title text,
    description text,
    photo text,
    "time" text,
    location text,
    user_id uuid,
    category_id integer,
    city_id integer
);
CREATE TABLE public.losts (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    title text,
    description text,
    photo text,
    "time" text,
    location text,
    user_id uuid,
    city_id integer,
    category_id integer
);
CREATE TABLE public.sessions (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    "sessionToken" text NOT NULL,
    "userId" uuid NOT NULL,
    expires timestamp with time zone
);
CREATE TABLE public.users (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text,
    "emailVerified" timestamp with time zone,
    image text,
    first_name text DEFAULT 'User'::text NOT NULL,
    last_name text DEFAULT 'User'::text NOT NULL,
    email text NOT NULL
);
COMMENT ON TABLE public.users IS 'Users table';
CREATE TABLE public.verification_tokens (
    token text NOT NULL,
    identifier text NOT NULL,
    expires timestamp with time zone
);
ALTER TABLE ONLY public."City" ALTER COLUMN id SET DEFAULT nextval('public."City_id_seq"'::regclass);
ALTER TABLE ONLY public.category ALTER COLUMN id SET DEFAULT nextval('public.category_id_seq'::regclass);
ALTER TABLE ONLY public."City"
    ADD CONSTRAINT "City_name_key" UNIQUE (name);
ALTER TABLE ONLY public."City"
    ADD CONSTRAINT "City_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_name_key UNIQUE (name);
ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.finds
    ADD CONSTRAINT finds_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.losts
    ADD CONSTRAINT losts_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.verification_tokens
    ADD CONSTRAINT verification_tokens_pkey PRIMARY KEY (token);
ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE CASCADE;
ALTER TABLE ONLY public.finds
    ADD CONSTRAINT finds_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.category(id) ON UPDATE RESTRICT ON DELETE SET NULL;
ALTER TABLE ONLY public.finds
    ADD CONSTRAINT finds_city_id_fkey FOREIGN KEY (city_id) REFERENCES public."City"(id) ON UPDATE SET NULL ON DELETE SET NULL;
ALTER TABLE ONLY public.finds
    ADD CONSTRAINT finds_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.losts
    ADD CONSTRAINT losts_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.category(id) ON UPDATE RESTRICT ON DELETE SET NULL;
ALTER TABLE ONLY public.losts
    ADD CONSTRAINT losts_city_id_fkey FOREIGN KEY (city_id) REFERENCES public."City"(id) ON UPDATE SET NULL ON DELETE SET NULL;
ALTER TABLE ONLY public.losts
    ADD CONSTRAINT losts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE CASCADE;
