-- Optional Slack / live project URL for portfolio card actions.

ALTER TABLE portfolio_assets ADD COLUMN IF NOT EXISTS project_url TEXT;
