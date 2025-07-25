-- Add "home" tag for filtering heroes on the home page
INSERT INTO public.tags (name, color) 
VALUES ('home', '#10B981')
ON CONFLICT (name) DO NOTHING; 