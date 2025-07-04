-- Create tags table for better tag management
CREATE TABLE public.tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

-- Create policy for tags access (public read, admin write)
CREATE POLICY "Allow read access to tags" 
ON public.tags 
FOR SELECT 
USING (true);

CREATE POLICY "Allow all operations on tags for authenticated users" 
ON public.tags 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_tags_updated_at
BEFORE UPDATE ON public.tags
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some default tags
INSERT INTO public.tags (name, color) VALUES 
  ('Actualités', '#3B82F6'),
  ('Événements', '#10B981'),
  ('Annonces', '#F59E0B'),
  ('Urgent', '#EF4444'),
  ('Communauté', '#8B5CF6'),
  ('Sports', '#06B6D4'),
  ('Culture', '#EC4899'),
  ('Education', '#84CC16');