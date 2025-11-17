CREATE OR REPLACE FUNCTION public.jsonb_text_array(jsonb_input jsonb)
RETURNS text[]
LANGUAGE sql
AS $func$
  SELECT COALESCE(array_agg(value), '{}')
  FROM jsonb_array_elements_text(COALESCE(jsonb_input, '[]'::jsonb));
$func$;--> statement-breakpoint
ALTER TABLE "photos" ALTER COLUMN "tag_ids" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "photos" ALTER COLUMN "tag_ids" SET DATA TYPE text[] USING public.jsonb_text_array("tag_ids");--> statement-breakpoint
ALTER TABLE "photos" ALTER COLUMN "tag_ids" SET DEFAULT ARRAY[]::text[];--> statement-breakpoint
ALTER TABLE "photos" ADD COLUMN "images" text[];--> statement-breakpoint
ALTER TABLE "photos" ADD COLUMN "published_at" date;--> statement-breakpoint
CREATE INDEX "idx_photos_tag_ids" ON "photos" USING gin ("tag_ids");--> statement-breakpoint
CREATE INDEX "idx_photos_images" ON "photos" USING gin ("images");--> statement-breakpoint
DROP FUNCTION public.jsonb_text_array(jsonb);--> statement-breakpoint
