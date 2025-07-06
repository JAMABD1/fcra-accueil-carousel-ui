-- Create coordonnes table
CREATE TABLE coordonnes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone VARCHAR(50),
    email VARCHAR(255),
    address TEXT,
    tags_id UUID REFERENCES tags(id) ON DELETE SET NULL,
    google_map_url TEXT,
    sort_order INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_coordonnes_tags_id ON coordonnes(tags_id);
CREATE INDEX IF NOT EXISTS idx_coordonnes_active ON coordonnes(active);
CREATE INDEX IF NOT EXISTS idx_coordonnes_sort_order ON coordonnes(sort_order);

-- Enable RLS (Row Level Security)
ALTER TABLE coordonnes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for coordonnes
CREATE POLICY "Allow public read access on coordonnes" ON coordonnes
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to manage coordonnes" ON coordonnes
    FOR ALL USING (auth.role() = 'authenticated');

-- Create updated_at trigger
CREATE TRIGGER update_coordonnes_updated_at 
    BEFORE UPDATE ON coordonnes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for coordonnes
INSERT INTO coordonnes (phone, email, address, google_map_url, sort_order, active) VALUES
    ('+261 20 22 123 45', 'contact@fcra.mg', 'Lot 123 Antananarivo 101, Madagascar', 'https://maps.google.com/maps?q=Antananarivo+Madagascar&output=embed', 1, true),
    ('+261 20 44 567 89', 'antsirabe@fcra.mg', 'Rue de la Paix Antsirabe 110, Madagascar', 'https://maps.google.com/maps?q=Antsirabe+Madagascar&output=embed', 2, true),
    ('+261 20 75 901 23', 'fianarantsoa@fcra.mg', 'Avenue de l''Indépendance Fianarantsoa 301, Madagascar', 'https://maps.google.com/maps?q=Fianarantsoa+Madagascar&output=embed', 3, true); 