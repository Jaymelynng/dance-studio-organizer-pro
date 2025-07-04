import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type Student = Tables<'students'> & {
  parent: Tables<'parents'> | null;
};

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: studentsError } = await supabase
        .from('students')
        .select(`
          *,
          parent:parents(*)
        `)
        .order('created_at', { ascending: false });

      if (studentsError) throw studentsError;

      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return { students, loading, error, refetch: fetchStudents };
};