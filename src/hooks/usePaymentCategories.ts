import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PaymentCategory {
  id: string;
  name: string;
  description: string | null;
  default_amount: number | null;
  division_specific: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export const usePaymentCategories = () => {
  return useQuery({
    queryKey: ['payment_categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      
      if (error) throw error;
      return data as PaymentCategory[];
    }
  });
};

export const useCreatePaymentCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (category: Omit<PaymentCategory, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('payment_categories')
        .insert(category)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment_categories'] });
      toast({
        title: "Success",
        description: "Payment category created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create payment category",
        variant: "destructive",
      });
    }
  });
};

export const useUpdatePaymentCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<PaymentCategory> & { id: string }) => {
      const { data, error } = await supabase
        .from('payment_categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment_categories'] });
      toast({
        title: "Success",
        description: "Payment category updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update payment category",
        variant: "destructive",
      });
    }
  });
};