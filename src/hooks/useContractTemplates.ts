import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ContractTemplate {
  id: string;
  name: string;
  division: string;
  season: string;
  html_content: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useContractTemplates = () => {
  const [templates, setTemplates] = useState<ContractTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('contract_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching contract templates:', error);
      toast({
        title: "Error",
        description: "Failed to fetch contract templates",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTemplate = async (template: Omit<ContractTemplate, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('contract_templates')
        .insert([template])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Contract template created successfully",
      });

      fetchTemplates();
      return data;
    } catch (error) {
      console.error('Error creating contract template:', error);
      toast({
        title: "Error",
        description: "Failed to create contract template",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateTemplate = async (id: string, updates: Partial<ContractTemplate>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('contract_templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Contract template updated successfully",
      });

      fetchTemplates();
      return data;
    } catch (error) {
      console.error('Error updating contract template:', error);
      toast({
        title: "Error",
        description: "Failed to update contract template",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteTemplate = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('contract_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Contract template deleted successfully",
      });

      fetchTemplates();
    } catch (error) {
      console.error('Error deleting contract template:', error);
      toast({
        title: "Error",
        description: "Failed to delete contract template",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return {
    templates,
    loading,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    refetch: fetchTemplates
  };
};