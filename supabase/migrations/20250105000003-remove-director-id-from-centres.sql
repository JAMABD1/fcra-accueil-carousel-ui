-- Remove director_id from centres table
ALTER TABLE centres DROP COLUMN IF EXISTS director_id;

-- Remove the related index
DROP INDEX IF EXISTS idx_centres_director_id; 