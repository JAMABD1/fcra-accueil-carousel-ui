-- Add Facebook iframe support to videos
ALTER TABLE public.videos
  ADD COLUMN IF NOT EXISTS facebook_iframe TEXT;

-- Optional: index not required for text embeds; reads are by id

