import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface StudentData {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  division: 'Professional' | 'Pre-Professional' | 'Supplemental';
  grade_level?: string;
  school_name?: string;
  dance_experience?: string;
  goals?: string;
  medical_notes?: string;
  dietary_restrictions?: string;
}

interface ParentData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
}

export const useStudentEnrollment = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createFullEnrollment = async (studentData: StudentData, parentData: ParentData) => {
    setLoading(true);
    try {
      // 1. Create parent record
      const { data: parent, error: parentError } = await supabase
        .from('parents')
        .insert([parentData])
        .select()
        .single();

      if (parentError) throw parentError;

      // 2. Create student record with parent reference
      const { data: student, error: studentError } = await supabase
        .from('students')
        .insert([{
          ...studentData,
          parent_id: parent.id,
          status: 'Active'
        }])
        .select()
        .single();

      if (studentError) throw studentError;

      // 3. Get tuition and fees based on division
      const { data: tuitionData, error: tuitionError } = await supabase
        .rpc('get_monthly_tuition', { div: studentData.division });

      if (tuitionError) throw tuitionError;

      const { data: feeData, error: feeError } = await supabase
        .rpc('get_registration_fee', { div: studentData.division });

      if (feeError) throw feeError;

      // 4. Generate contract number
      const { data: contractNumber, error: contractError } = await supabase
        .rpc('generate_contract_number');

      if (contractError) throw contractError;

      // 5. Create contract
      const { data: contract, error: contractCreationError } = await supabase
        .from('contracts')
        .insert([{
          student_id: student.id,
          division: studentData.division,
          status: 'Active',
          monthly_tuition: tuitionData,
          registration_fee: feeData,
          contract_number: contractNumber,
          season: '2024-2025',
          contract_start_date: new Date().toISOString().split('T')[0],
          contract_end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }])
        .select()
        .single();

      if (contractCreationError) throw contractCreationError;

      // 6. Create payment schedules for the next 10 months
      const paymentSchedules = Array.from({ length: 10 }, (_, i) => {
        const dueDate = new Date();
        dueDate.setMonth(dueDate.getMonth() + i + 1);
        return {
          contract_id: contract.id,
          amount: tuitionData,
          due_date: dueDate.toISOString().split('T')[0],
          payment_type: 'Monthly Tuition',
          status: 'Pending' as const
        };
      });

      const { error: paymentsError } = await supabase
        .from('payment_schedules')
        .insert(paymentSchedules);

      if (paymentsError) throw paymentsError;

      // 7. Create activity log
      const { error: activityError } = await supabase
        .from('activities')
        .insert([{
          student_id: student.id,
          contract_id: contract.id,
          type: 'enrollment',
          description: `Student enrolled in ${studentData.division} division`,
          status: 'success'
        }]);

      if (activityError) throw activityError;

      toast({
        title: "Enrollment Complete!",
        description: `${studentData.first_name} ${studentData.last_name} has been successfully enrolled.`,
      });

      return { student, parent, contract };

    } catch (error) {
      console.error('Enrollment error:', error);
      toast({
        title: "Enrollment Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createFullEnrollment,
    loading
  };
};