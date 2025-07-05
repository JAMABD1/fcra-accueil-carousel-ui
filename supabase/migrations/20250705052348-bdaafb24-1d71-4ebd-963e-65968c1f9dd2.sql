-- Create a table for videos
CREATE TABLE public.videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  excerpt TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  author TEXT,
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'draft',
  duration INTEGER, -- in seconds
  file_size BIGINT, -- in bytes
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Create policies for video access
CREATE POLICY "Allow all operations on videos" 
ON public.videos 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_videos_updated_at
BEFORE UPDATE ON public.videos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for videos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
  'videos', 
  'videos', 
  true, 
  629145600, -- 600MB in bytes
  ARRAY['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov', 'video/wmv']
);

-- Create policies for video uploads
CREATE POLICY "Allow public access to videos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'videos');

CREATE POLICY "Allow authenticated users to upload videos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'videos');

CREATE POLICY "Allow authenticated users to update videos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'videos');

CREATE POLICY "Allow authenticated users to delete videos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'videos');