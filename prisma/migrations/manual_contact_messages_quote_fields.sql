-- Expand contact_messages for quote-wizard submissions (name + phone + quiz answers).
-- Risk: LOW — additive nullable/defaulted columns; existing rows keep current values.

ALTER TABLE contact_messages
  ADD COLUMN IF NOT EXISTS phone TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS project_type TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS project_goal TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS budget TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS timeline TEXT NOT NULL DEFAULT '';

ALTER TABLE contact_messages
  ALTER COLUMN email SET DEFAULT '',
  ALTER COLUMN message SET DEFAULT '';
