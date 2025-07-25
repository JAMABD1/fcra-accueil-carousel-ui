-- Add tag_id column to centres
ALTER TABLE public.centres ADD COLUMN IF NOT EXISTS tag_id uuid NULL;

-- Remove hero_id column and its foreign key constraint
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='centres' AND column_name='hero_id') THEN
    ALTER TABLE public.centres DROP CONSTRAINT IF EXISTS centres_hero_id_fkey;
    ALTER TABLE public.centres DROP COLUMN IF EXISTS hero_id;
  END IF;
END $$;

-- Add foreign key constraint for tag_id
ALTER TABLE public.centres ADD CONSTRAINT IF NOT EXISTS centres_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE SET NULL;

-- Drop the hero_id index if it exists
DROP INDEX IF EXISTS idx_centres_hero_id; 