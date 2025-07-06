import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const usePayments = () => {
  return useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          student:students(first_name, last_name, division),
          payment_schedule:payment_schedules(due_date, payment_type),
          category:payment_categories(name, description)
        `)
        .order('payment_date', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });
};

export const usePaymentSchedules = () => {
  return useQuery({
    queryKey: ['payment_schedules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_schedules')
        .select(`
          *,
          contract:contracts(
            student:students(first_name, last_name, division)
          ),
          category:payment_categories(name, description)
        `)
        .order('due_date', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });
};

export const useStudentsForPayment = () => {
  return useQuery({
    queryKey: ['students-payment'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select('id, first_name, last_name, division')
        .eq('status', 'Active')
        .order('last_name');
      
      if (error) throw error;
      return data;
    }
  });
};

export const useRecordPayment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ studentId, categoryId, amount, method, notes }: { 
      studentId: string; 
      categoryId: string; 
      amount: string; 
      method: string; 
      notes: string;
    }) => {
      const { data, error } = await supabase
        .from('payments')
        .insert({
          student_id: studentId,
          category_id: categoryId,
          amount: parseFloat(amount),
          payment_method: method as any,
          payment_date: new Date().toISOString(),
          notes: notes || null
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['payment_schedules'] });
      toast({
        title: "Payment Recorded",
        description: "Payment has been successfully recorded",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to record payment",
        variant: "destructive",
      });
    }
  });
};