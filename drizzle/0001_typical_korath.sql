CREATE TYPE "public"."approval_decision" AS ENUM('approve', 'reject');--> statement-breakpoint
CREATE TYPE "public"."claim_status" AS ENUM('pending', 'approved', 'rejected', 'paid');--> statement-breakpoint
CREATE TABLE "claim_approvals" (
	"id" text PRIMARY KEY NOT NULL,
	"claim_id" text NOT NULL,
	"delegate_address" text NOT NULL,
	"decision" "approval_decision" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "claims" (
	"id" text PRIMARY KEY NOT NULL,
	"pool_id" text NOT NULL,
	"requester_address" text NOT NULL,
	"requester_name" text,
	"category" text NOT NULL,
	"amount_bs" numeric(18, 2),
	"amount_usdc" numeric(18, 7) NOT NULL,
	"photo_data_url" text NOT NULL,
	"quote_data_url" text,
	"description" text,
	"status" "claim_status" DEFAULT 'pending' NOT NULL,
	"payout_tx_hash" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "delegates" (
	"id" text PRIMARY KEY NOT NULL,
	"pool_id" text NOT NULL,
	"address" text NOT NULL,
	"name" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "contributions" ADD COLUMN "over_goal" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "claim_approvals" ADD CONSTRAINT "claim_approvals_claim_id_claims_id_fk" FOREIGN KEY ("claim_id") REFERENCES "public"."claims"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "claims" ADD CONSTRAINT "claims_pool_id_pools_id_fk" FOREIGN KEY ("pool_id") REFERENCES "public"."pools"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delegates" ADD CONSTRAINT "delegates_pool_id_pools_id_fk" FOREIGN KEY ("pool_id") REFERENCES "public"."pools"("id") ON DELETE no action ON UPDATE no action;