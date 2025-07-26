-- Create storage bucket for library files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
  'library', 
  'library', 
  true, 
  104857600, -- 100MB for library files
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/plain', 'application/zip', 'application/x-zip-compressed']
);

-- Create library table
CREATE TABLE public.library (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL, -- in bytes
  file_type TEXT NOT NULL, -- MIME type
  category TEXT NOT NULL DEFAULT 'general',
  downloads INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  author TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_library_category ON public.library(category);
CREATE INDEX idx_library_status ON public.library(status);
CREATE INDEX idx_library_featured ON public.library(featured);
CREATE INDEX idx_library_created_at ON public.library(created_at DESC);
CREATE INDEX idx_library_downloads ON public.library(downloads DESC);
CREATE INDEX idx_library_tags ON public.library USING GIN(tags);

-- Enable RLS
ALTER TABLE public.library ENABLE ROW LEVEL SECURITY;

-- Create policies for library
CREATE POLICY "Allow all operations on library" 
ON public.library 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create policies for library storage
CREATE POLICY "Allow public access to library files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'library');

CREATE POLICY "Allow authenticated users to upload library files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'library');

CREATE POLICY "Allow authenticated users to update library files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'library');

CREATE POLICY "Allow authenticated users to delete library files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'library');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_library_updated_at
BEFORE UPDATE ON public.library
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.library (title, description, file_url, file_name, file_size, file_type, category, downloads, featured, author, tags) VALUES
('Les Fondements de la Jurisprudence Islamique', 'Traité complet sur les principes fondamentaux du Fiqh et de la jurisprudence islamique.', '/library/fondements-jurisprudence.pdf', 'fondements-jurisprudence.pdf', 2621440, 'application/pdf', 'jurisprudence', 245, true, 'Cheikh Al-Fiqh', ARRAY['jurisprudence', 'fiqh', 'fondements']),
('La Sagesse dans les Hadiths du Prophète', 'Recueil de hadiths contenant la sagesse et les enseignements du Prophète Muhammad (ﷺ).', '/library/sagesse-hadiths.pdf', 'sagesse-hadiths.pdf', 1258291, 'application/pdf', 'sagesse', 567, false, 'Imam Al-Hikma', ARRAY['sagesse', 'hadiths', 'enseignement']),
('Traité de Théologie Islamique', 'Étude approfondie de la théologie islamique et des fondements de la foi.', '/library/traite-theologie.pdf', 'traite-theologie.pdf', 819200, 'application/pdf', 'theologie', 189, false, 'Dr. Al-Aqida', ARRAY['theologie', 'aqida', 'foi']),
('Sahih Al-Bukhari - Volume 1', 'Premier volume de la collection authentique des hadiths par Imam Al-Bukhari.', '/library/sahih-bukhari-vol1.pdf', 'sahih-bukhari-vol1.pdf', 1887436, 'application/pdf', 'hadith', 123, false, 'Imam Al-Bukhari', ARRAY['hadith', 'bukhari', 'authentique']),
('Tafsir Al-Quran - Sourate Al-Baqara', 'Exégèse détaillée de la sourate Al-Baqara avec explications et commentaires.', '/library/tafsir-baqara.pdf', 'tafsir-baqara.pdf', 3355443, 'application/pdf', 'tafsir', 334, true, 'Moufassir Al-Quran', ARRAY['tafsir', 'exegese', 'quran']),
('Histoire de l''Islam - Les Premiers Califes', 'Récit historique des premiers califes et de l''expansion de l''Islam.', '/library/histoire-premiers-califes.pdf', 'histoire-premiers-califes.pdf', 1572864, 'application/pdf', 'histoire', 156, false, 'Historien Al-Islam', ARRAY['histoire', 'califes', 'expansion']); 