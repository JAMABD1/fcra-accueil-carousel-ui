-- Update photos table to support bulk image uploads
-- Add images array field to store multiple images
ALTER TABLE public.photos ADD COLUMN IF NOT EXISTS images TEXT[];

-- Update the existing image_url to be the main/thumbnail image
-- The images array will contain all uploaded images for bulk uploads
-- For single images, the images array will contain just the main image

-- Update existing photos to populate images array with current image_url
UPDATE public.photos 
SET images = ARRAY[image_url] 
WHERE images IS NULL AND image_url IS NOT NULL;

-- Create index on images array for performance
CREATE INDEX IF NOT EXISTS idx_photos_images ON public.photos USING GIN(images);

-- Update sample data to include multiple images for demonstration
UPDATE public.photos 
SET images = ARRAY[
  'https://images.unsplash.com/photo-1587855049254-351f8c69b935?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1587855049254-351f8c69b935?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1587855049254-351f8c69b935?w=800&h=600&fit=crop'
] 
WHERE title = 'Madagascar Landscape' AND images IS NOT NULL;

-- Create a function to validate images array
CREATE OR REPLACE FUNCTION validate_photo_images()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure images array is not empty if provided
  IF NEW.images IS NOT NULL AND array_length(NEW.images, 1) = 0 THEN
    RAISE EXCEPTION 'Images array cannot be empty';
  END IF;
  
  -- If images array is provided, set the first image as the main image_url
  IF NEW.images IS NOT NULL AND array_length(NEW.images, 1) > 0 THEN
    NEW.image_url = NEW.images[1];
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to validate images
DROP TRIGGER IF EXISTS validate_photos_images_trigger ON public.photos;
CREATE TRIGGER validate_photos_images_trigger
  BEFORE INSERT OR UPDATE ON public.photos
  FOR EACH ROW
  EXECUTE FUNCTION validate_photo_images(); 