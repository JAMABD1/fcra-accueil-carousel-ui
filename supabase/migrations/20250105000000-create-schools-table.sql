-- Create storage bucket for schools
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
  'schools', 
  'schools', 
  true, 
  52428800, -- 50MB for school images
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Create schools table
CREATE TABLE public.schools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL, -- 'primaire', 'secondaire', etc.
  address TEXT,
  phone TEXT,
  email TEXT,
  director TEXT,
  capacity INTEGER,
  programs TEXT[], -- Array of program names
  facilities TEXT[], -- Array of facility names
  image_url TEXT,
  images TEXT[], -- Array of image URLs
  status TEXT DEFAULT 'published',
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;

-- Create policies for schools
CREATE POLICY "Allow all operations on schools" 
ON public.schools 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create policies for school storage
CREATE POLICY "Allow public access to schools" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'schools');

CREATE POLICY "Allow authenticated users to upload school images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'schools');

CREATE POLICY "Allow authenticated users to update school images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'schools');

CREATE POLICY "Allow authenticated users to delete school images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'schools');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_schools_updated_at
BEFORE UPDATE ON public.schools
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample schools data
INSERT INTO public.schools (name, description, type, address, phone, email, director, capacity, programs, facilities, image_url, status, featured) VALUES
('École Primaire Centrale', 'Éducation de base solide pour les enfants de 6 à 12 ans avec un programme complet et des enseignants qualifiés.', 'primaire', '123 Rue de l''Éducation, Antananarivo', '+261 20 22 123 45', 'primaire@fcras.mg', 'Mme Rakoto Andry', 300, 
 ARRAY['Mathématiques', 'Français', 'Malagasy', 'Sciences', 'Arts'], 
 ARRAY['Salle informatique', 'Bibliothèque', 'Cour de récréation', 'Cantine'], 
 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=400&fit=crop', 
 'published', true),
 
('École Secondaire Moderne', 'Préparation aux études supérieures et à la vie professionnelle avec des programmes spécialisés.', 'secondaire', '456 Avenue des Sciences, Antananarivo', '+261 20 22 678 90', 'secondaire@fcras.mg', 'M. Randria Jean', 500, 
 ARRAY['Sciences Physiques', 'Mathématiques', 'Littérature', 'Informatique', 'Langues'], 
 ARRAY['Laboratoire de sciences', 'Salle informatique', 'Bibliothèque', 'Terrain de sport'], 
 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=400&fit=crop', 
 'published', true),
 
('Institut Technique Professionnel', 'Formation technique et professionnelle pour préparer les étudiants au marché du travail.', 'technique', '789 Route Technique, Antananarivo', '+261 20 22 345 67', 'technique@fcras.mg', 'M. Razafy Paul', 250, 
 ARRAY['Électronique', 'Mécanique', 'Informatique', 'Gestion'], 
 ARRAY['Atelier technique', 'Salle informatique', 'Laboratoire', 'Salle de conférence'], 
 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=600&h=400&fit=crop', 
 'published', false); 