-- Add is_private column to events table
-- Run this migration to enable private event feature

ALTER TABLE events 
ADD COLUMN is_private BOOLEAN DEFAULT FALSE AFTER status;

-- Update existing events to be public by default
UPDATE events SET is_private = FALSE WHERE is_private IS NULL;
