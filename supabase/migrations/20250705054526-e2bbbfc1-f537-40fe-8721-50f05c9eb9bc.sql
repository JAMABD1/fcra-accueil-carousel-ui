-- Create storage bucket for video thumbnails
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
  'video-thumbnails', 
  'video-thumbnails', 
  true, 
  10485760, -- 10MB for thumbnails
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Update videos bucket to allow 700MB instead of 600MB
UPDATE storage.buckets 
SET file_size_limit = 734003200 -- 700MB in bytes
WHERE id = 'videos';

-- Create policies for video thumbnail uploads
CREATE POLICY "Allow public access to video thumbnails" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'video-thumbnails');

CREATE POLICY "Allow authenticated users to upload video thumbnails" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'video-thumbnails');

CREATE POLICY "Allow authenticated users to update video thumbnails" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'video-thumbnails');

CREATE POLICY "Allow authenticated users to delete video thumbnails" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'video-thumbnails');