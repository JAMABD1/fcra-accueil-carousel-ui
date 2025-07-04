-- Create storage bucket for article images
INSERT INTO storage.buckets (id, name, public) VALUES ('article-images', 'article-images', true);

-- Create policies for article images
CREATE POLICY "Article images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'article-images');

CREATE POLICY "Anyone can upload article images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'article-images');

CREATE POLICY "Anyone can update article images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'article-images');

CREATE POLICY "Anyone can delete article images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'article-images');

-- Modify articles table to store multiple images
ALTER TABLE public.articles 
DROP COLUMN image_url,
ADD COLUMN images TEXT[] DEFAULT '{}' NOT NULL;