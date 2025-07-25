-- Update schools table to add new fields
ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS tagname TEXT;
ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS hero_id UUID REFERENCES public.hero(id) ON DELETE SET NULL;
ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS subtitle TEXT;
ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS coordonne_id UUID REFERENCES public.coordonnes(id) ON DELETE SET NULL;

-- Update directors table to add schoolId
ALTER TABLE public.directors ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_schools_tagname ON public.schools(tagname);
CREATE INDEX IF NOT EXISTS idx_schools_hero_id ON public.schools(hero_id);
CREATE INDEX IF NOT EXISTS idx_schools_coordonne_id ON public.schools(coordonne_id);
CREATE INDEX IF NOT EXISTS idx_directors_school_id ON public.directors(school_id);

-- Update sample data with new fields
UPDATE public.schools 
SET 
  tagname = 'education',
  subtitle = 'Excellence académique pour tous',
  hero_id = (SELECT id FROM public.hero WHERE title = 'Bienvenue chez FCRA' LIMIT 1),
  coordonne_id = (SELECT id FROM public.coordonnes WHERE phone = '+261 20 22 123 45' LIMIT 1)
WHERE name = 'École Primaire Centrale';

UPDATE public.schools 
SET 
  tagname = 'education',
  subtitle = 'Formation supérieure de qualité',
  hero_id = (SELECT id FROM public.hero WHERE title = 'Notre Mission' LIMIT 1),
  coordonne_id = (SELECT id FROM public.coordonnes WHERE phone = '+261 20 44 567 89' LIMIT 1)
WHERE name = 'École Secondaire Moderne';

UPDATE public.schools 
SET 
  tagname = 'technique',
  subtitle = 'Expertise technique pour l\'avenir',
  hero_id = (SELECT id FROM public.hero WHERE title = 'Bienvenue chez FCRA' LIMIT 1),
  coordonne_id = (SELECT id FROM public.coordonnes WHERE phone = '+261 20 75 901 23' LIMIT 1)
WHERE name = 'Institut Technique Professionnel';

-- Add more sample schools with new structure
INSERT INTO public.schools (
  name, description, type, address, phone, email, director, capacity, 
  programs, facilities, image_url, status, featured, tagname, subtitle
) VALUES
(
  'École Polyvalente Sainte-Marie', 
  'Une éducation holistique qui forme les leaders de demain avec des valeurs chrétiennes solides.', 
  'polyvalente', 
  'Avenue Sainte-Marie, Antananarivo', 
  '+261 20 22 789 01', 
  'marie@fcras.mg', 
  'Sœur Marie-Claire', 
  450, 
  ARRAY['Formation générale', 'Formation technique', 'Éducation religieuse', 'Sports', 'Arts'], 
  ARRAY['Chapelle', 'Laboratoire', 'Bibliothèque', 'Terrain de sport', 'Salle d\'art'], 
  'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=600&h=400&fit=crop', 
  'published', 
  true,
  'education',
  'Formation complète pour un avenir prometteur'
),
(
  'Centre de Formation Professionnelle', 
  'Spécialisé dans les métiers techniques et artisanaux avec une approche pratique et moderne.', 
  'professionnel', 
  'Zone Industrielle, Antananarivo', 
  '+261 20 22 234 56', 
  'cfp@fcras.mg', 
  'M. Rakoto Andry', 
  200, 
  ARRAY['Menuiserie', 'Électricité', 'Plomberie', 'Couture', 'Informatique'], 
  ARRAY['Atelier menuiserie', 'Atelier électricité', 'Salle informatique', 'Atelier couture'], 
  'https://images.unsplash.com/photo-1581092335397-9583eb92d232?w=600&h=400&fit=crop', 
  'published', 
  true,
  'technique',
  'Maîtrise technique et savoir-faire'
),
(
  'École Rurale de Antsirabe', 
  'Éducation adaptée au contexte rural avec un programme enrichi en agriculture et développement durable.', 
  'rurale', 
  'Commune d\'Antsirabe Ville', 
  '+261 20 44 123 45', 
  'rurale@fcras.mg', 
  'Mme Rasoanirina', 
  180, 
  ARRAY['Agriculture', 'Élevage', 'Développement durable', 'Éducation de base'], 
  ARRAY['Ferme pédagogique', 'Jardin potager', 'Salle de classe', 'Bibliothèque'], 
  'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=600&h=400&fit=crop', 
  'published', 
  false,
  'agriculture',
  'L\'éducation au cœur du développement rural'
);

-- Update some directors to be associated with schools
UPDATE public.directors 
SET school_id = (SELECT id FROM public.schools WHERE name = 'École Primaire Centrale' LIMIT 1)
WHERE name = 'Jean Baptiste ANDRIAMAMPIANINA';

UPDATE public.directors 
SET school_id = (SELECT id FROM public.schools WHERE name = 'École Secondaire Moderne' LIMIT 1)
WHERE name = 'Marie RASOANIRINA';

-- Add sample directors for the new schools
INSERT INTO public.directors (
  name, job, responsibility, image_url, sort_order, is_director, active, school_id
) VALUES
(
  'Sœur Marie-Claire RAZAFY', 
  'Directrice d\'École', 
  'Direction pédagogique et spirituelle de l\'école polyvalente', 
  'https://images.unsplash.com/photo-1494790108755-2616c9c65c3c?w=200&h=200&fit=crop', 
  5, 
  true, 
  true, 
  (SELECT id FROM public.schools WHERE name = 'École Polyvalente Sainte-Marie' LIMIT 1)
),
(
  'Rakoto Andry RANDRIANARISOA', 
  'Directeur Technique', 
  'Coordination des formations techniques et professionnelles', 
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop', 
  6, 
  true, 
  true, 
  (SELECT id FROM public.schools WHERE name = 'Centre de Formation Professionnelle' LIMIT 1)
),
(
  'Rasoanirina RAKOTOMANGA', 
  'Directrice Rurale', 
  'Développement de l\'éducation en milieu rural', 
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop', 
  7, 
  true, 
  true, 
  (SELECT id FROM public.schools WHERE name = 'École Rurale de Antsirabe' LIMIT 1)
); 