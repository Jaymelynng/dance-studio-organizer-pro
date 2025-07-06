import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface TuitionRate {
  id: string;
  division: 'Professional' | 'Pre-Professional' | 'Supplemental';
  monthly_tuition: number;
  registration_fee: number;
  season: string;
  effective_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useTuitionRates = () => {
  return useQuery({
    queryKey: ['tuition_rates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tuition_rates')
        .select('*')
        .eq('is_active', true)
        .order('division');
      
      if (error) throw error;
      return data as TuitionRate[];
    }
  });
};

export const useUpdateTuitionRate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<TuitionRate> & { id: string }) => {
      const { data, error } = await supabase
        .from('tuition_rates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tuition_rates'] });
      toast({
        title: "Success",
        description: "Tuition rates updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update tuition rates",
        variant: "destructive",
      });
    }
  });
};