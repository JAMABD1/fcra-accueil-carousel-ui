ALTER TABLE "hero" ADD COLUMN "tag_ids" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
CREATE INDEX "hero_tag_ids_idx" ON "hero" USING btree ("tag_ids");