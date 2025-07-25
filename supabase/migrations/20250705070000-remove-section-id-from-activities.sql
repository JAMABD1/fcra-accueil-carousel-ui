-- Remove section_id column and its foreign key constraint from activities
ALTER TABLE public.activities DROP CONSTRAINT IF EXISTS activities_section_id_fkey;
ALTER TABLE public.activities DROP COLUMN IF EXISTS section_id;
DROP INDEX IF EXISTS idx_activities_section_id; 