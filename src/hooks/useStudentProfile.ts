import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';

type Student = Tables<'students'> & {
  parent: Tables<'parents'> | null;
};

export const useStudentProfile = (studentId: string | undefined) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchStudent = async () => {
    if (!studentId) return;
    
    try {
      setLoading(true);
      setError(null);

      const { data, error: studentError } = await supabase
        .from('students')
        .select(`
          *,
          parent:parents(*)
        `)
        .eq('id', studentId)
        .single();

      if (studentError) throw studentError;
      setStudent(data);
    } catch (error) {
      console.error('Error fetching student:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateStudent = async (studentData: Partial<Tables<'students'>>, parentData?: Partial<Tables<'parents'>>) => {
    if (!student) return false;

    try {
      // Update student
      const { error: studentError } = await supabase
        .from('students')
        .update(studentData)
        .eq('id', student.id);

      if (studentError) throw studentError;

      // Update parent if provided
      if (parentData && student.parent) {
        const { error: parentError } = await supabase
          .from('parents')
          .update(parentData)
          .eq('id', student.parent.id);

        if (parentError) throw parentError;
      }

      toast({
        title: "Success",
        description: "Student information updated successfully",
      });

      // Refresh student data
      await fetchStudent();
      return true;
    } catch (error) {
      console.error('Error updating student:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to update student',
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchStudent();
  }, [studentId]);

  return { student, loading, error, updateStudent, refetch: fetchStudent };
};