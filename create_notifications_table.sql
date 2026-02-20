-- Create Notification table
CREATE TABLE IF NOT EXISTS "Notification" (
    "id"         TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "user_id"    TEXT NOT NULL,
    "type"       TEXT NOT NULL,
    "title"      TEXT NOT NULL,
    "message"    TEXT NOT NULL,
    "read"       BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Index for fast per-user lookups
CREATE INDEX IF NOT EXISTS "Notification_user_id_idx" ON "Notification"("user_id");
