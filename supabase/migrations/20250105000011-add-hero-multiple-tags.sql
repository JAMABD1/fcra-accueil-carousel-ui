-- Add tag_ids JSON array to hero table for multiple tags
ALTER TABLE hero ADD COLUMN IF NOT EXISTS tag_ids JSONB DEFAULT '[]'::jsonb;

-- Create index for better performance on JSON column
CREATE INDEX IF NOT EXISTS idx_hero_tag_ids ON hero USING GIN (tag_ids);

-- Create a function to get tag names for heroes
CREATE OR REPLACE FUNCTION get_hero_tag_names_for_ids(tag_ids_param jsonb)
RETURNS text[] AS $$
BEGIN
    RETURN ARRAY(
        SELECT t.name
        FROM tags t
        WHERE t.id::text = ANY(SELECT jsonb_array_elements_text(tag_ids_param))
    );
END;
$$ LANGUAGE plpgsql; 