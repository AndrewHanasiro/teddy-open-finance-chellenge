-- migrate:up
CREATE TABLE IF NOT EXISTS "users" (
    id SERIAL PRIMARY KEY NOT NULL,
	public_id UUID DEFAULT uuidv7() NOT NULL,
	"name" TEXT NOT NULL,
	email TEXT NOT NULL,
	"password" TEXT NOT NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "UQ_users_email" UNIQUE (email)
);
CREATE INDEX IF NOT EXISTS "idx_users_email" ON "users" ("email");

CREATE TABLE IF NOT EXISTS "clients" (
	id SERIAL PRIMARY KEY NOT NULL,
	public_id UUID DEFAULT uuidv7() NOT NULL,
	name TEXT NOT NULL,
	email TEXT NOT NULL,
	salary INTEGER NOT NULL,
	valuation INTEGER NOT NULL,
    created_at timestamp DEFAULT now() NOT NULL,
	deleted_at timestamp NULL
);
CREATE INDEX IF NOT EXISTS "idx_clients_public_id" ON "clients" ("public_id");
CREATE INDEX IF NOT EXISTS "idx_clients_active" ON "clients" (id) WHERE deleted_at IS NULL;

-- migrate:down
DROP INDEX IF EXISTS "idx_clients_active";
DROP INDEX IF EXISTS "idx_clients_public_id";
DROP INDEX IF EXISTS "idx_users_email";

DROP TABLE IF EXISTS "clients";
DROP TABLE IF EXISTS "users";