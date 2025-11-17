ALTER TABLE "videos" ALTER COLUMN "video_url" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "videos" ADD COLUMN "video_type" varchar(20) DEFAULT 'upload';--> statement-breakpoint
ALTER TABLE "videos" ADD COLUMN "youtube_id" varchar(100);--> statement-breakpoint
ALTER TABLE "videos" ADD COLUMN "facebook_iframe" text;--> statement-breakpoint
CREATE INDEX "idx_videos_video_type" ON "videos" USING btree ("video_type");--> statement-breakpoint
CREATE INDEX "idx_videos_youtube_id" ON "videos" USING btree ("youtube_id");