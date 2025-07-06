-- Create directors table
CREATE TABLE directors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    image_url TEXT,
    job VARCHAR(255),
    responsibility TEXT,
    sort_order INTEGER DEFAULT 0,
    centre_id UUID REFERENCES centres(id) ON DELETE SET NULL,
    is_director BOOLEAN DEFAULT false,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create centres table
CREATE TABLE centres (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    hero_id UUID REFERENCES hero(id) ON DELETE SET NULL,
    video_id UUID REFERENCES videos(id) ON DELETE SET NULL,
    director_id UUID REFERENCES directors(id) ON DELETE SET NULL,
    sort_order INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add centre_id reference to directors after centres table is created
-- (This creates the bidirectional relationship)

-- Modify videos table to support YouTube videos
ALTER TABLE videos ADD COLUMN IF NOT EXISTS video_type VARCHAR(20) DEFAULT 'upload';
ALTER TABLE videos ADD COLUMN IF NOT EXISTS youtube_id VARCHAR(100);
ALTER TABLE videos ADD COLUMN IF NOT EXISTS duration INTEGER;

-- Update videos table constraint to make file_url nullable for YouTube videos
ALTER TABLE videos ALTER COLUMN file_url DROP NOT NULL;

-- Create directors storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'directors',
    'directors',
    true,
    10485760, -- 10MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_directors_centre_id ON directors(centre_id);
CREATE INDEX IF NOT EXISTS idx_directors_is_director ON directors(is_director);
CREATE INDEX IF NOT EXISTS idx_directors_active ON directors(active);
CREATE INDEX IF NOT EXISTS idx_directors_sort_order ON directors(sort_order);

CREATE INDEX IF NOT EXISTS idx_centres_hero_id ON centres(hero_id);
CREATE INDEX IF NOT EXISTS idx_centres_video_id ON centres(video_id);
CREATE INDEX IF NOT EXISTS idx_centres_director_id ON centres(director_id);
CREATE INDEX IF NOT EXISTS idx_centres_active ON centres(active);
CREATE INDEX IF NOT EXISTS idx_centres_sort_order ON centres(sort_order);

CREATE INDEX IF NOT EXISTS idx_videos_video_type ON videos(video_type);
CREATE INDEX IF NOT EXISTS idx_videos_youtube_id ON videos(youtube_id);

-- Enable RLS (Row Level Security)
ALTER TABLE directors ENABLE ROW LEVEL SECURITY;
ALTER TABLE centres ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for directors
CREATE POLICY "Allow public read access on directors" ON directors
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to manage directors" ON directors
    FOR ALL USING (auth.role() = 'authenticated');

-- Create RLS policies for centres
CREATE POLICY "Allow public read access on centres" ON centres
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to manage centres" ON centres
    FOR ALL USING (auth.role() = 'authenticated');

-- Create RLS policies for directors storage bucket
CREATE POLICY "Allow public read access on directors bucket" ON storage.objects
    FOR SELECT USING (bucket_id = 'directors');

CREATE POLICY "Allow authenticated users to manage directors bucket" ON storage.objects
    FOR ALL USING (bucket_id = 'directors' AND auth.role() = 'authenticated');

-- Create updated_at trigger functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_directors_updated_at 
    BEFORE UPDATE ON directors 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_centres_updated_at 
    BEFORE UPDATE ON centres 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for directors
INSERT INTO directors (name, job, responsibility, sort_order, is_director, active) VALUES
    ('Jean Baptiste ANDRIAMAMPIANINA', 'Directeur Général', 'Supervision générale des activités du FCRA', 1, true, true),
    ('Marie RASOANIRINA', 'Directrice Pédagogique', 'Coordination des programmes éducatifs', 2, true, true),
    ('Paul RAKOTONDRASOA', 'Responsable Technique', 'Gestion des infrastructures et équipements', 3, false, true),
    ('Sophie RANDRIAMANALINA', 'Responsable Administrative', 'Gestion administrative et financière', 4, false, true);

-- Insert sample data for centres
INSERT INTO centres (name, description, address, phone, email, sort_order, active) VALUES
    ('Centre Principal Antananarivo', 'Centre principal du FCRA situé dans la capitale', 'Lot 123 Antananarivo 101', '+261 20 22 123 45', 'antananarivo@fcra.mg', 1, true),
    ('Centre Antsirabe', 'Centre régional du FCRA à Antsirabe', 'Rue de la Paix Antsirabe 110', '+261 20 44 567 89', 'antsirabe@fcra.mg', 2, true),
    ('Centre Fianarantsoa', 'Centre régional du FCRA à Fianarantsoa', 'Avenue de l\'Indépendance Fianarantsoa 301', '+261 20 75 901 23', 'fianarantsoa@fcra.mg', 3, true),
    ('Centre Toamasina', 'Centre côtier du FCRA à Toamasina', 'Boulevard Joffre Toamasina 501', '+261 20 53 456 78', 'toamasina@fcra.mg', 4, true);

-- Add some sample YouTube videos
INSERT INTO videos (title, description, video_type, youtube_id, duration, sort_order, active) VALUES
    ('Présentation du FCRA', 'Vidéo de présentation officielle du FCRA', 'youtube', 'dQw4w9WgXcQ', 240, 1, true),
    ('Activités Pédagogiques', 'Aperçu des activités pédagogiques du FCRA', 'youtube', 'oHg5SJYRHA0', 300, 2, true),
    ('Témoignages d\'Étudiants', 'Témoignages d\'étudiants du FCRA', 'youtube', 'kJQP7kiw5Fk', 180, 3, true); 