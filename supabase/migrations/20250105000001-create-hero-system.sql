-- Create storage buckets for hero system
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) VALUES 
  ('hero', 'hero', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('impact', 'impact', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('sections', 'sections', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']);

-- Create hero table
CREATE TABLE public.hero (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create impact table (for counter statistics)
CREATE TABLE public.impact (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  number INTEGER NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  tags_id UUID REFERENCES public.tags(id) ON DELETE SET NULL,
  active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sections table
CREATE TABLE public.sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  hero_id UUID REFERENCES public.hero(id) ON DELETE SET NULL,
  tag_name TEXT,
  active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_hero_active ON public.hero(active);
CREATE INDEX idx_hero_sort_order ON public.hero(sort_order);
CREATE INDEX idx_impact_active ON public.impact(active);
CREATE INDEX idx_impact_sort_order ON public.impact(sort_order);
CREATE INDEX idx_impact_tags_id ON public.impact(tags_id);
CREATE INDEX idx_sections_active ON public.sections(active);
CREATE INDEX idx_sections_sort_order ON public.sections(sort_order);
CREATE INDEX idx_sections_hero_id ON public.sections(hero_id);

-- Enable Row Level Security
ALTER TABLE public.hero ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impact ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;

-- Create policies for hero table
CREATE POLICY "Allow read access to hero" ON public.hero FOR SELECT USING (true);
CREATE POLICY "Allow all operations on hero for authenticated users" ON public.hero FOR ALL USING (true) WITH CHECK (true);

-- Create policies for impact table
CREATE POLICY "Allow read access to impact" ON public.impact FOR SELECT USING (true);
CREATE POLICY "Allow all operations on impact for authenticated users" ON public.impact FOR ALL USING (true) WITH CHECK (true);

-- Create policies for sections table
CREATE POLICY "Allow read access to sections" ON public.sections FOR SELECT USING (true);
CREATE POLICY "Allow all operations on sections for authenticated users" ON public.sections FOR ALL USING (true) WITH CHECK (true);

-- Create storage policies for hero bucket
CREATE POLICY "Allow public access to hero images" ON storage.objects FOR SELECT USING (bucket_id = 'hero');
CREATE POLICY "Allow authenticated users to upload hero images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'hero');
CREATE POLICY "Allow authenticated users to update hero images" ON storage.objects FOR UPDATE USING (bucket_id = 'hero');
CREATE POLICY "Allow authenticated users to delete hero images" ON storage.objects FOR DELETE USING (bucket_id = 'hero');

-- Create storage policies for impact bucket
CREATE POLICY "Allow public access to impact images" ON storage.objects FOR SELECT USING (bucket_id = 'impact');
CREATE POLICY "Allow authenticated users to upload impact images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'impact');
CREATE POLICY "Allow authenticated users to update impact images" ON storage.objects FOR UPDATE USING (bucket_id = 'impact');
CREATE POLICY "Allow authenticated users to delete impact images" ON storage.objects FOR DELETE USING (bucket_id = 'impact');

-- Create storage policies for sections bucket
CREATE POLICY "Allow public access to sections images" ON storage.objects FOR SELECT USING (bucket_id = 'sections');
CREATE POLICY "Allow authenticated users to upload sections images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'sections');
CREATE POLICY "Allow authenticated users to update sections images" ON storage.objects FOR UPDATE USING (bucket_id = 'sections');
CREATE POLICY "Allow authenticated users to delete sections images" ON storage.objects FOR DELETE USING (bucket_id = 'sections');

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_hero_updated_at
BEFORE UPDATE ON public.hero
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_impact_updated_at
BEFORE UPDATE ON public.impact
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sections_updated_at
BEFORE UPDATE ON public.sections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.hero (title, subtitle, image_url, sort_order, active) VALUES 
  ('Bienvenue chez FCRA', 'Organisation dédiée à l''éducation et au développement social', '/lovable-uploads/586b3ef5-3f2c-4e08-9ed5-25bbc640d5da.png', 1, true),
  ('Notre Mission', 'Créer un avenir meilleur pour tous', '/lovable-uploads/120bc1b5-8776-4510-8628-3d1ca45aef5f.png', 2, true);

INSERT INTO public.impact (number, title, subtitle, sort_order, active) VALUES 
  (300, 'Étudiants Universitaires', 'Enfants universitaires par an', 1, true),
  (1000, 'Orphelinat', 'Enfants orphelins filles et garçons pris en charge', 2, true);

INSERT INTO public.sections (title, subtitle, description, image_url, tag_name, sort_order, active) VALUES 
  ('Étudiants Universitaires', 'Soutien académique', 'Accompagnement et soutien des étudiants dans leur parcours académique.', '/lovable-uploads/586b3ef5-3f2c-4e08-9ed5-25bbc640d5da.png', 'Education', 1, true),
  ('Orphelinat', 'Prise en charge', 'Prise en charge et éducation des enfants orphelins.', 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=200&fit=crop', 'Communauté', 2, true),
  ('RVS', 'Formation professionnelle', 'Programmes de formation et développement des compétences.', 'https://images.unsplash.com/photo-1581091870632-5a5ad36db9c6?w=400&h=200&fit=crop', 'Education', 3, true); 