-- Add hero_ids JSON array to sections table for multiple heroes
ALTER TABLE sections ADD COLUMN IF NOT EXISTS hero_ids JSONB DEFAULT '[]'::jsonb;

-- Add tag_ids JSON array to sections table for multiple tags
ALTER TABLE sections ADD COLUMN IF NOT EXISTS tag_ids JSONB DEFAULT '[]'::jsonb;

-- Modify impact table to support multiple tags
ALTER TABLE impact ADD COLUMN IF NOT EXISTS tag_ids JSONB DEFAULT '[]'::jsonb;

-- Create indexes for better performance on JSON columns
CREATE INDEX IF NOT EXISTS idx_sections_hero_ids ON sections USING GIN (hero_ids);
CREATE INDEX IF NOT EXISTS idx_sections_tag_ids ON sections USING GIN (tag_ids);
CREATE INDEX IF NOT EXISTS idx_impact_tag_ids ON impact USING GIN (tag_ids);

-- Migrate existing hero_id to hero_ids array for sections
UPDATE sections 
SET hero_ids = CASE 
    WHEN hero_id IS NOT NULL THEN jsonb_build_array(hero_id::text)
    ELSE '[]'::jsonb 
END
WHERE hero_ids = '[]'::jsonb;

-- Migrate existing tags_id to tag_ids array for impact
UPDATE impact 
SET tag_ids = CASE 
    WHEN tags_id IS NOT NULL THEN jsonb_build_array(tags_id::text)
    ELSE '[]'::jsonb 
END
WHERE tag_ids = '[]'::jsonb;

-- Create a function to get hero titles for sections
CREATE OR REPLACE FUNCTION get_hero_titles_for_section(hero_ids_param jsonb)
RETURNS text[] AS $$
BEGIN
    RETURN ARRAY(
        SELECT h.title
        FROM hero h
        WHERE h.id::text = ANY(SELECT jsonb_array_elements_text(hero_ids_param))
    );
END;
$$ LANGUAGE plpgsql;

-- Create a function to get tag names for sections and impact
CREATE OR REPLACE FUNCTION get_tag_names_for_ids(tag_ids_param jsonb)
RETURNS text[] AS $$
BEGIN
    RETURN ARRAY(
        SELECT t.name
        FROM tags t
        WHERE t.id::text = ANY(SELECT jsonb_array_elements_text(tag_ids_param))
    );
END;
$$ LANGUAGE plpgsql; 