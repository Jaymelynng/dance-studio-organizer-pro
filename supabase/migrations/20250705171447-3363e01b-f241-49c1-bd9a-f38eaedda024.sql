-- Create storage bucket for template images
INSERT INTO storage.buckets (id, name, public) VALUES ('template-images', 'template-images', true);

-- Create policies for template images
CREATE POLICY "Template images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'template-images');

CREATE POLICY "Anyone can upload template images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'template-images');

CREATE POLICY "Anyone can update template images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'template-images');

CREATE POLICY "Anyone can delete template images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'template-images');