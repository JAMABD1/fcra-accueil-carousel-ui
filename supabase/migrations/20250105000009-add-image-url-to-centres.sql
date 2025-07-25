-- Add image_url field to centres table
ALTER TABLE centres ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Create centres storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'centres',
    'centres',
    true,
    10485760, -- 10MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for centres storage bucket
CREATE POLICY "Allow public read access on centres bucket" ON storage.objects
    FOR SELECT USING (bucket_id = 'centres');

CREATE POLICY "Allow authenticated users to manage centres bucket" ON storage.objects
    FOR ALL USING (bucket_id = 'centres' AND auth.role() = 'authenticated'); 