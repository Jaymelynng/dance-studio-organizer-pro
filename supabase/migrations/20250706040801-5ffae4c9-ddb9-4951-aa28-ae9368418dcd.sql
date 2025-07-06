-- Add form_data column to store structured data separately from HTML
ALTER TABLE public.contract_templates 
ADD COLUMN form_data JSONB;

-- Update existing templates with empty form_data for now
UPDATE public.contract_templates 
SET form_data = '{}'::jsonb 
WHERE form_data IS NULL;