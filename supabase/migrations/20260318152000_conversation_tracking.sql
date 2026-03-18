-- Add conversation tracking fields to generations table
ALTER TABLE "public"."generations" 
ADD COLUMN "status" text NOT NULL DEFAULT 'not_sent',
ADD COLUMN "status_updated_at" timestamptz;

-- Add constraint for valid statuses
ALTER TABLE "public"."generations"
ADD CONSTRAINT "valid_generation_status" 
CHECK ("status" IN ('not_sent', 'sent', 'responded', 'no_response'));

-- Backfill status_updated_at for existing records
UPDATE "public"."generations"
SET "status_updated_at" = "created_at"
WHERE "status_updated_at" IS NULL;
