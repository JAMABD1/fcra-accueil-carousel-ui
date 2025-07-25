-- Remove tagname column
ALTER TABLE public.schools DROP COLUMN IF EXISTS tagname;

-- Add tag_id column and FK
ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS tag_id uuid NULL;
ALTER TABLE public.schools ADD CONSTRAINT IF NOT EXISTS schools_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_schools_tag_id ON public.schools (tag_id);

-- Add video_id column and FK
ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS video_id uuid NULL;
ALTER TABLE public.schools ADD CONSTRAINT IF NOT EXISTS schools_video_id_fkey FOREIGN KEY (video_id) REFERENCES videos (id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_schools_video_id ON public.schools (video_id);

-- Add active column
ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS active boolean NULL DEFAULT true;

-- Add sort_order column
ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS sort_order integer NULL DEFAULT 0;
CREATE INDEX IF NOT EXISTS idx_schools_sort_order ON public.schools (sort_order); 