-- Create storage bucket for schools
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
  'schools', 
  'schools', 
  true, 
  52428800, -- 50MB for school images
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for schools bucket
CREATE POLICY "Anyone can view school images" ON storage.objects 
  FOR SELECT USING (bucket_id = 'schools');

CREATE POLICY "Authenticated users can upload school images" ON storage.objects 
  FOR INSERT WITH CHECK (bucket_id = 'schools' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update school images" ON storage.objects 
  FOR UPDATE USING (bucket_id = 'schools' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete school images" ON storage.objects 
  FOR DELETE USING (bucket_id = 'schools' AND auth.role() = 'authenticated'); 