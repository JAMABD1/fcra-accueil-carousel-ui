CREATE TABLE "activities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"subtitle" text,
	"description" text,
	"section_id" uuid,
	"video_id" uuid,
	"photo_id" uuid,
	"video_description" text,
	"photo_description" text,
	"tag_id" uuid,
	"sort_order" integer DEFAULT 0,
	"active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "articles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"excerpt" text,
	"images" jsonb DEFAULT '[]'::jsonb,
	"author" text,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"featured" boolean DEFAULT false,
	"status" text DEFAULT 'draft',
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "centres" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"address" text,
	"phone" text,
	"email" text,
	"hero_id" uuid,
	"video_id" uuid,
	"director_id" uuid,
	"tag_id" uuid,
	"image_url" text,
	"sort_order" integer DEFAULT 0,
	"active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "coordonnes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"phone" text,
	"email" text,
	"address" text,
	"tags_id" uuid,
	"google_map_url" text,
	"sort_order" integer DEFAULT 0,
	"active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "directors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"image_url" text,
	"job" text,
	"responsibility" text,
	"sort_order" integer DEFAULT 0,
	"centre_id" uuid,
	"is_director" boolean DEFAULT false,
	"active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hero" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"subtitle" text,
	"image_url" text NOT NULL,
	"sort_order" integer DEFAULT 0,
	"active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "impact" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"number" integer NOT NULL,
	"title" text NOT NULL,
	"subtitle" text,
	"tags_id" uuid,
	"tag_ids" jsonb DEFAULT '[]'::jsonb,
	"active" boolean DEFAULT true,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "library" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"file_url" text NOT NULL,
	"file_name" text NOT NULL,
	"file_size" bigint NOT NULL,
	"file_type" text NOT NULL,
	"category" text DEFAULT 'general' NOT NULL,
	"downloads" integer DEFAULT 0,
	"featured" boolean DEFAULT false,
	"status" text DEFAULT 'published',
	"author" text,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "partners" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"subtitle" text,
	"description" text,
	"image_url" text NOT NULL,
	"tag_ids" jsonb DEFAULT '[]'::jsonb,
	"sort_order" integer DEFAULT 0,
	"active" boolean DEFAULT true,
	"website_url" text,
	"contact_email" text,
	"contact_phone" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "photos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"image_url" text NOT NULL,
	"thumbnail_url" text,
	"category" text DEFAULT 'General' NOT NULL,
	"tag_ids" jsonb DEFAULT '[]'::jsonb,
	"featured" boolean DEFAULT false,
	"status" text DEFAULT 'published',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "schools" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"type" text NOT NULL,
	"address" text,
	"phone" text,
	"email" text,
	"director" text,
	"capacity" integer,
	"programs" jsonb DEFAULT '[]'::jsonb,
	"facilities" jsonb DEFAULT '[]'::jsonb,
	"image_url" text,
	"images" jsonb DEFAULT '[]'::jsonb,
	"status" text DEFAULT 'published',
	"featured" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"subtitle" text,
	"description" text,
	"image_url" text NOT NULL,
	"hero_id" uuid,
	"tag_name" text,
	"tag_ids" jsonb DEFAULT '[]'::jsonb,
	"active" boolean DEFAULT true,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"color" text DEFAULT '#3B82F6',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tags_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "videos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"excerpt" text,
	"video_url" text NOT NULL,
	"thumbnail_url" text,
	"author" text,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"featured" boolean DEFAULT false,
	"status" text DEFAULT 'draft',
	"duration" integer,
	"file_size" bigint,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_section_id_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."sections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_video_id_videos_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."videos"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_photo_id_photos_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."photos"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "centres" ADD CONSTRAINT "centres_hero_id_hero_id_fk" FOREIGN KEY ("hero_id") REFERENCES "public"."hero"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "centres" ADD CONSTRAINT "centres_video_id_videos_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."videos"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "centres" ADD CONSTRAINT "centres_director_id_directors_id_fk" FOREIGN KEY ("director_id") REFERENCES "public"."directors"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "centres" ADD CONSTRAINT "centres_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coordonnes" ADD CONSTRAINT "coordonnes_tags_id_tags_id_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "directors" ADD CONSTRAINT "directors_centre_id_centres_id_fk" FOREIGN KEY ("centre_id") REFERENCES "public"."centres"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "impact" ADD CONSTRAINT "impact_tags_id_tags_id_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sections" ADD CONSTRAINT "sections_hero_id_hero_id_fk" FOREIGN KEY ("hero_id") REFERENCES "public"."hero"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "activities_section_id_idx" ON "activities" USING btree ("section_id");--> statement-breakpoint
CREATE INDEX "activities_video_id_idx" ON "activities" USING btree ("video_id");--> statement-breakpoint
CREATE INDEX "activities_photo_id_idx" ON "activities" USING btree ("photo_id");--> statement-breakpoint
CREATE INDEX "activities_tag_id_idx" ON "activities" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "activities_sort_order_idx" ON "activities" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "activities_active_idx" ON "activities" USING btree ("active");--> statement-breakpoint
CREATE INDEX "articles_status_idx" ON "articles" USING btree ("status");--> statement-breakpoint
CREATE INDEX "articles_created_at_idx" ON "articles" USING btree ("created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "articles_featured_idx" ON "articles" USING btree ("featured");--> statement-breakpoint
CREATE INDEX "centres_hero_id_idx" ON "centres" USING btree ("hero_id");--> statement-breakpoint
CREATE INDEX "centres_video_id_idx" ON "centres" USING btree ("video_id");--> statement-breakpoint
CREATE INDEX "centres_director_id_idx" ON "centres" USING btree ("director_id");--> statement-breakpoint
CREATE INDEX "centres_active_idx" ON "centres" USING btree ("active");--> statement-breakpoint
CREATE INDEX "centres_sort_order_idx" ON "centres" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "coordonnes_tags_id_idx" ON "coordonnes" USING btree ("tags_id");--> statement-breakpoint
CREATE INDEX "coordonnes_active_idx" ON "coordonnes" USING btree ("active");--> statement-breakpoint
CREATE INDEX "coordonnes_sort_order_idx" ON "coordonnes" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "directors_centre_id_idx" ON "directors" USING btree ("centre_id");--> statement-breakpoint
CREATE INDEX "directors_is_director_idx" ON "directors" USING btree ("is_director");--> statement-breakpoint
CREATE INDEX "directors_active_idx" ON "directors" USING btree ("active");--> statement-breakpoint
CREATE INDEX "directors_sort_order_idx" ON "directors" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "hero_active_idx" ON "hero" USING btree ("active");--> statement-breakpoint
CREATE INDEX "hero_sort_order_idx" ON "hero" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "impact_active_idx" ON "impact" USING btree ("active");--> statement-breakpoint
CREATE INDEX "impact_sort_order_idx" ON "impact" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "impact_tags_id_idx" ON "impact" USING btree ("tags_id");--> statement-breakpoint
CREATE INDEX "library_category_idx" ON "library" USING btree ("category");--> statement-breakpoint
CREATE INDEX "library_status_idx" ON "library" USING btree ("status");--> statement-breakpoint
CREATE INDEX "library_featured_idx" ON "library" USING btree ("featured");--> statement-breakpoint
CREATE INDEX "library_downloads_idx" ON "library" USING btree ("downloads" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "partners_active_idx" ON "partners" USING btree ("active");--> statement-breakpoint
CREATE INDEX "partners_sort_order_idx" ON "partners" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "photos_category_idx" ON "photos" USING btree ("category");--> statement-breakpoint
CREATE INDEX "photos_status_idx" ON "photos" USING btree ("status");--> statement-breakpoint
CREATE INDEX "photos_featured_idx" ON "photos" USING btree ("featured");--> statement-breakpoint
CREATE INDEX "schools_type_idx" ON "schools" USING btree ("type");--> statement-breakpoint
CREATE INDEX "schools_status_idx" ON "schools" USING btree ("status");--> statement-breakpoint
CREATE INDEX "schools_featured_idx" ON "schools" USING btree ("featured");--> statement-breakpoint
CREATE INDEX "sections_active_idx" ON "sections" USING btree ("active");--> statement-breakpoint
CREATE INDEX "sections_sort_order_idx" ON "sections" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "sections_hero_id_idx" ON "sections" USING btree ("hero_id");--> statement-breakpoint
CREATE INDEX "tags_name_idx" ON "tags" USING btree ("name");--> statement-breakpoint
CREATE INDEX "videos_status_idx" ON "videos" USING btree ("status");--> statement-breakpoint
CREATE INDEX "videos_featured_idx" ON "videos" USING btree ("featured");