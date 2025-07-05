-- Create storage bucket for photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
  'photos', 
  'photos', 
  true, 
  52428800, -- 50MB for photos
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Create photos table
CREATE TABLE public.photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT NOT NULL DEFAULT 'General',
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'published',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

-- Create policies for photos
CREATE POLICY "Allow all operations on photos" 
ON public.photos 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create policies for photo storage
CREATE POLICY "Allow public access to photos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'photos');

CREATE POLICY "Allow authenticated users to upload photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'photos');

CREATE POLICY "Allow authenticated users to update photos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'photos');

CREATE POLICY "Allow authenticated users to delete photos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'photos');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_photos_updated_at
BEFORE UPDATE ON public.photos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();