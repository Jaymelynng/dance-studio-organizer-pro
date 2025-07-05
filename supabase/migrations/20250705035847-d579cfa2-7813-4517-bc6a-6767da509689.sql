-- Create a parent record for Ellie
INSERT INTO parents (first_name, last_name, email, phone, address, city, state, zip_code, emergency_contact_name, emergency_contact_phone, emergency_contact_relationship)
VALUES ('Parent', 'Toscano', 'parent.toscano@example.com', '(555) 123-4567', '123 Main Street', 'Sample City', 'CA', '90210', 'Emergency Contact', '(555) 987-6543', 'Grandparent');

-- Update Ellie's record to link to the parent and add some basic info
UPDATE students 
SET 
  parent_id = (SELECT id FROM parents WHERE last_name = 'Toscano' LIMIT 1),
  grade_level = '9th Grade',
  school_name = 'Sample High School',
  dance_experience = 'Student has been dancing for several years with classical training.',
  goals = 'Continue developing professional dance skills and technique.'
WHERE id = '17e07d7a-ae5c-4a59-8273-27df8886363b';