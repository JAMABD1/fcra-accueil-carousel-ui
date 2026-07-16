ALTER TABLE "centres" ADD COLUMN IF NOT EXISTS "hero_ids" jsonb DEFAULT '[]'::jsonb;
ALTER TABLE "schools" ADD COLUMN IF NOT EXISTS "hero_ids" jsonb DEFAULT '[]'::jsonb;
ALTER TABLE "sections" ADD COLUMN IF NOT EXISTS "hero_ids" jsonb DEFAULT '[]'::jsonb;
