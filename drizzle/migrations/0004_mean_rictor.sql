DROP INDEX "schools_type_idx";--> statement-breakpoint
DROP INDEX "schools_status_idx";--> statement-breakpoint
DROP INDEX "schools_featured_idx";--> statement-breakpoint
ALTER TABLE "schools" ADD COLUMN "subtitle" text;--> statement-breakpoint
ALTER TABLE "schools" ADD COLUMN "coordonne_id" uuid;--> statement-breakpoint
ALTER TABLE "schools" ADD COLUMN "tag_id" uuid;--> statement-breakpoint
ALTER TABLE "schools" ADD COLUMN "video_id" uuid;--> statement-breakpoint
ALTER TABLE "schools" ADD COLUMN "active" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "schools" ADD COLUMN "sort_order" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "schools" ADD CONSTRAINT "schools_coordonne_id_coordonnes_id_fk" FOREIGN KEY ("coordonne_id") REFERENCES "public"."coordonnes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schools" ADD CONSTRAINT "schools_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schools" ADD CONSTRAINT "schools_video_id_videos_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."videos"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_schools_tag_id" ON "schools" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "idx_schools_video_id" ON "schools" USING btree ("video_id");--> statement-breakpoint
CREATE INDEX "idx_schools_coordonne_id" ON "schools" USING btree ("coordonne_id");--> statement-breakpoint
ALTER TABLE "schools" DROP COLUMN "address";--> statement-breakpoint
ALTER TABLE "schools" DROP COLUMN "phone";--> statement-breakpoint
ALTER TABLE "schools" DROP COLUMN "email";--> statement-breakpoint
ALTER TABLE "schools" DROP COLUMN "director";--> statement-breakpoint
ALTER TABLE "schools" DROP COLUMN "capacity";--> statement-breakpoint
ALTER TABLE "schools" DROP COLUMN "programs";--> statement-breakpoint
ALTER TABLE "schools" DROP COLUMN "facilities";--> statement-breakpoint
ALTER TABLE "schools" DROP COLUMN "images";--> statement-breakpoint
ALTER TABLE "schools" DROP COLUMN "status";--> statement-breakpoint
ALTER TABLE "schools" DROP COLUMN "featured";