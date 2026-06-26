-- Add portfolio ordering and visibility before schema push.

ALTER TABLE portfolio_assets ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;
ALTER TABLE portfolio_assets ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'ACTIVE';

WITH ordered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC) - 1 AS new_order
  FROM portfolio_assets
)
UPDATE portfolio_assets
SET sort_order = ordered.new_order
FROM ordered
WHERE portfolio_assets.id = ordered.id;
