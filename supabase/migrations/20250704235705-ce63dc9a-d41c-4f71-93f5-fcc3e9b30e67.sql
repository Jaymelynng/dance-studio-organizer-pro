-- Fix Ellie Toscano's missing contract and payment data
-- First, let's create a contract for Ellie (Professional division student)
INSERT INTO contracts (
  student_id,
  division,
  status,
  monthly_tuition,
  registration_fee,
  contract_number,
  season,
  contract_start_date,
  contract_end_date
)
SELECT 
  s.id,
  s.division,
  'Active',
  get_monthly_tuition(s.division),
  get_registration_fee(s.division),
  generate_contract_number(),
  '2024-2025',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '1 year'
FROM students s 
WHERE s.first_name = 'Ellie' AND s.last_name = 'Toscano'
AND NOT EXISTS (SELECT 1 FROM contracts c WHERE c.student_id = s.id);

-- Create payment schedules for the next 10 months
INSERT INTO payment_schedules (
  contract_id,
  amount,
  due_date,
  payment_type,
  status
)
SELECT 
  c.id,
  c.monthly_tuition,
  CURRENT_DATE + (generate_series(1, 10) || ' month')::INTERVAL,
  'Monthly Tuition',
  'Pending'
FROM contracts c
JOIN students s ON c.student_id = s.id
WHERE s.first_name = 'Ellie' AND s.last_name = 'Toscano';

-- Create activity logs for Ellie's enrollment
INSERT INTO activities (
  student_id,
  contract_id,
  type,
  description,
  status
)
SELECT 
  s.id,
  c.id,
  'enrollment',
  'Student enrolled in ' || s.division || ' division',
  'success'
FROM students s
JOIN contracts c ON c.student_id = s.id
WHERE s.first_name = 'Ellie' AND s.last_name = 'Toscano'
AND NOT EXISTS (SELECT 1 FROM activities a WHERE a.student_id = s.id AND a.type = 'enrollment');