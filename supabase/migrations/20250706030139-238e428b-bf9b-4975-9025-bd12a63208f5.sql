-- Create payment categories table
CREATE TABLE public.payment_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  default_amount DECIMAL(10,2),
  division_specific BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert default payment categories
INSERT INTO public.payment_categories (name, description, default_amount, division_specific, sort_order) VALUES
('Monthly Tuition', 'Regular monthly tuition payments', NULL, true, 1),
('Registration Fee', 'One-time registration fee', NULL, true, 2),
('Competition Fee', 'Fees for competition participation', 150.00, false, 3),
('Costume Fee', 'Costume rental or purchase fees', 75.00, false, 4),
('Workshop Fee', 'Special workshop or masterclass fees', 50.00, false, 5),
('Recital Fee', 'Annual recital participation fee', 100.00, false, 6),
('Late Fee', 'Late payment penalty', 25.00, false, 7),
('Material Fee', 'Books, music, and other materials', 30.00, false, 8),
('Private Lesson', 'Individual instruction sessions', 80.00, false, 9),
('Summer Intensive', 'Summer program fees', 500.00, false, 10);

-- Enable RLS
ALTER TABLE public.payment_categories ENABLE ROW LEVEL SECURITY;

-- Create RLS policy
CREATE POLICY "Allow all access to payment categories" 
ON public.payment_categories 
FOR ALL 
USING (true);

-- Create tuition rates table to replace hardcoded values
CREATE TABLE public.tuition_rates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  division division_type NOT NULL,
  monthly_tuition DECIMAL(10,2) NOT NULL,
  registration_fee DECIMAL(10,2) NOT NULL,
  season TEXT DEFAULT 'Current',
  effective_date DATE DEFAULT CURRENT_DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert current tuition rates
INSERT INTO public.tuition_rates (division, monthly_tuition, registration_fee) VALUES
('Professional', 1800.00, 350.00),
('Pre-Professional', 1400.00, 350.00),
('Supplemental', 390.00, 200.00);

-- Enable RLS
ALTER TABLE public.tuition_rates ENABLE ROW LEVEL SECURITY;

-- Create RLS policy
CREATE POLICY "Allow all access to tuition rates" 
ON public.tuition_rates 
FOR ALL 
USING (true);

-- Add category_id to payment_schedules
ALTER TABLE public.payment_schedules 
ADD COLUMN category_id UUID REFERENCES public.payment_categories(id);

-- Update existing payment schedules to use categories
UPDATE public.payment_schedules 
SET category_id = (
  SELECT id FROM public.payment_categories 
  WHERE name = CASE 
    WHEN payment_schedules.payment_type = 'Monthly Tuition' THEN 'Monthly Tuition'
    WHEN payment_schedules.payment_type = 'Registration Fee' THEN 'Registration Fee'
    ELSE 'Monthly Tuition'
  END
);

-- Add category_id to payments table
ALTER TABLE public.payments 
ADD COLUMN category_id UUID REFERENCES public.payment_categories(id);

-- Update existing payments to use categories  
UPDATE public.payments 
SET category_id = (
  SELECT id FROM public.payment_categories 
  WHERE name = 'Monthly Tuition'
);

-- Add triggers for updated_at
CREATE TRIGGER update_payment_categories_updated_at
BEFORE UPDATE ON public.payment_categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tuition_rates_updated_at
BEFORE UPDATE ON public.tuition_rates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Replace hardcoded database functions with configurable ones
CREATE OR REPLACE FUNCTION public.get_monthly_tuition(div division_type)
RETURNS DECIMAL(10,2)
LANGUAGE sql
STABLE
AS $$
  SELECT monthly_tuition 
  FROM public.tuition_rates 
  WHERE division = div AND is_active = true
  ORDER BY effective_date DESC 
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.get_registration_fee(div division_type)
RETURNS DECIMAL(10,2)
LANGUAGE sql
STABLE
AS $$
  SELECT registration_fee 
  FROM public.tuition_rates 
  WHERE division = div AND is_active = true
  ORDER BY effective_date DESC 
  LIMIT 1;
$$;