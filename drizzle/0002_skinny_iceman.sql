CREATE TYPE "public"."earn_kind" AS ENUM('deposit', 'withdraw');--> statement-breakpoint
CREATE TABLE "earn_movements" (
	"id" text PRIMARY KEY NOT NULL,
	"address" text NOT NULL,
	"provider" text NOT NULL,
	"opportunity_id" text NOT NULL,
	"kind" "earn_kind" NOT NULL,
	"amount" numeric(18, 7) NOT NULL,
	"asset_code" text NOT NULL,
	"tx_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "earn_movements_tx_hash_unique" UNIQUE("tx_hash")
);
