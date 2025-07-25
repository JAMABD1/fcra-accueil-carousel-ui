-- Remove hero_id column and its foreign key constraint from schools
ALTER TABLE public.schools DROP CONSTRAINT IF EXISTS schools_hero_id_fkey;
ALTER TABLE public.schools DROP COLUMN IF EXISTS hero_id;
DROP INDEX IF EXISTS idx_schools_hero_id; 