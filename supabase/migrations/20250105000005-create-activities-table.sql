-- Create activities table
CREATE TABLE public.activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  -- Can either reference a section or have individual content
  section_id UUID REFERENCES public.sections(id) ON DELETE CASCADE,
  video_id UUID REFERENCES public.videos(id) ON DELETE SET NULL,
  photo_id UUID REFERENCES public.photos(id) ON DELETE SET NULL,
  video_description TEXT,
  photo_description TEXT,
  tag_id UUID REFERENCES public.tags(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Create policies for activities
CREATE POLICY "Allow all operations on activities" 
ON public.activities 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_activities_section_id ON public.activities(section_id);
CREATE INDEX idx_activities_video_id ON public.activities(video_id);
CREATE INDEX idx_activities_photo_id ON public.activities(photo_id);
CREATE INDEX idx_activities_tag_id ON public.activities(tag_id);
CREATE INDEX idx_activities_sort_order ON public.activities(sort_order);
CREATE INDEX idx_activities_active ON public.activities(active);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_activities_updated_at
BEFORE UPDATE ON public.activities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.activities (title, subtitle, description, active, sort_order) VALUES
('Cultural Workshop', 'Traditional Crafts', 'Learn traditional Malagasy crafts and techniques from local artisans', true, 1),
('Nature Hike', 'Forest Exploration', 'Guided hike through Madagascar''s unique forests and wildlife', true, 2),
('Educational Program', 'Community Learning', 'Educational sessions with local schools and communities', true, 3),
('Conservation Project', 'Wildlife Protection', 'Participate in local conservation efforts and wildlife protection', true, 4),
('Language Exchange', 'Cultural Immersion', 'Practice Malagasy language with local families and communities', true, 5); 