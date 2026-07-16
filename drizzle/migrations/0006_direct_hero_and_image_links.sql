ALTER TABLE "centres" ADD COLUMN IF NOT EXISTS "mission_images" text[];
ALTER TABLE "centres" ADD COLUMN IF NOT EXISTS "history_images" text[];
ALTER TABLE "schools" ADD COLUMN IF NOT EXISTS "hero_id" uuid REFERENCES "hero"("id") ON DELETE SET NULL;
ALTER TABLE "schools" ADD COLUMN IF NOT EXISTS "mission_images" text[];
ALTER TABLE "schools" ADD COLUMN IF NOT EXISTS "history_images" text[];
CREATE INDEX IF NOT EXISTS "idx_schools_hero_id" ON "schools" ("hero_id");
ALTER TABLE "sections" ADD COLUMN IF NOT EXISTS "gallery_images" text[];
