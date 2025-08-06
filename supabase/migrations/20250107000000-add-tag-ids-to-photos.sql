-- Add tag_ids column to photos table
ALTER TABLE public.photos 
ADD COLUMN tag_ids text[] DEFAULT '{}';

-- Create index for tag_ids for better query performance
CREATE INDEX IF NOT EXISTS idx_photos_tag_ids ON public.photos USING GIN (tag_ids);

-- Update the photos table structure comment
COMMENT ON TABLE public.photos IS 'Photos table with tag support for categorization and filtering';

-- Add comment for the new column
COMMENT ON COLUMN public.photos.tag_ids IS 'Array of tag IDs for categorizing photos';
