-- Create partners table
CREATE TABLE public.partners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  tag_ids TEXT[] DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  website_url TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- Create policies for partner access
CREATE POLICY "Allow all operations on partners" 
ON public.partners 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_partners_updated_at
BEFORE UPDATE ON public.partners
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for partner images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
  'partners', 
  'partners', 
  true, 
  10485760, -- 10MB in bytes
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
);

-- Create policies for partner image uploads
CREATE POLICY "Allow public access to partner images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'partners');

CREATE POLICY "Allow authenticated users to upload partner images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'partners');

CREATE POLICY "Allow authenticated users to update partner images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'partners');

CREATE POLICY "Allow authenticated users to delete partner images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'partners');

-- Create index for better performance
CREATE INDEX idx_partners_active ON public.partners(active);
CREATE INDEX idx_partners_sort_order ON public.partners(sort_order);
CREATE INDEX idx_partners_tag_ids ON public.partners USING GIN(tag_ids); 