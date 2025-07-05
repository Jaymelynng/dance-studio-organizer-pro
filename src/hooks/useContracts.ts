import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Contract {
  id: string;
  contract_number: string;
  student_id: string;
  division: string;
  status: string;
  monthly_tuition: number;
  registration_fee: number;
  season: string;
  contract_start_date: string | null;
  contract_end_date: string | null;
  parent_signature_date: string | null;
  student_signature_date: string | null;
  director_signature_date: string | null;
  created_at: string;
  updated_at: string;
  students: {
    id: string;
    first_name: string;
    last_name: string;
    division: string;
    parents: {
      id: string;
      first_name: string;
      last_name: string;
      email: string;
      phone: string | null;
    };
  };
}

export const useContracts = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchContracts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select(`
          *,
          students (
            id,
            first_name,
            last_name,
            division,
            parents (
              id,
              first_name,
              last_name,
              email,
              phone
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContracts(data || []);
    } catch (error) {
      console.error('Error fetching contracts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch contracts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateContractStatus = async (id: string, status: 'Draft' | 'Sent' | 'Signed' | 'Active' | 'Expired' | 'Terminated') => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('contracts')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Contract status updated successfully",
      });

      fetchContracts();
    } catch (error) {
      console.error('Error updating contract status:', error);
      toast({
        title: "Error",
        description: "Failed to update contract status",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateSignature = async (id: string, signatureType: 'parent' | 'student' | 'director') => {
    setLoading(true);
    try {
      const signatureField = `${signatureType}_signature_date`;
      const { error } = await supabase
        .from('contracts')
        .update({ 
          [signatureField]: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${signatureType} signature recorded successfully`,
      });

      fetchContracts();
    } catch (error) {
      console.error('Error updating signature:', error);
      toast({
        title: "Error",
        description: "Failed to update signature",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  return {
    contracts,
    loading,
    updateContractStatus,
    updateSignature,
    refetch: fetchContracts
  };
};