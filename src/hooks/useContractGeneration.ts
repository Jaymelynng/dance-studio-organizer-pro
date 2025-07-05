import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface StudentContractData {
  student_id: string;
  student_name: string;
  student_dob: string;
  division: string;
  parent_names: string;
  parent_address: string;
  parent_phone: string;
  parent_email: string;
  monthly_tuition: string;
  season: string;
}

export const useContractGeneration = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateContract = async (templateId: string, studentId: string) => {
    setLoading(true);
    try {
      // Fetch template
      const { data: template, error: templateError } = await supabase
        .from('contract_templates')
        .select('*')
        .eq('id', templateId)
        .single();

      if (templateError) throw templateError;

      // Fetch student and parent data
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select(`
          *,
          parents (*)
        `)
        .eq('id', studentId)
        .single();

      if (studentError) throw studentError;

      // Get tuition amount
      const { data: tuitionData, error: tuitionError } = await supabase
        .rpc('get_monthly_tuition', { div: student.division });

      if (tuitionError) throw tuitionError;

      // Prepare contract data
      const contractData: StudentContractData = {
        student_id: student.id,
        student_name: `${student.first_name} ${student.last_name}`,
        student_dob: student.date_of_birth || '',
        division: student.division,
        parent_names: `${student.parents.first_name} ${student.parents.last_name}`,
        parent_address: `${student.parents.address || ''} ${student.parents.city || ''} ${student.parents.state || ''} ${student.parents.zip_code || ''}`.trim(),
        parent_phone: student.parents.phone || '',
        parent_email: student.parents.email || '',
        monthly_tuition: tuitionData.toString(),
        season: template.season
      };

      // Replace template variables
      let generatedHtml = template.html_content;
      Object.entries(contractData).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        generatedHtml = generatedHtml.replace(regex, value);
      });

      // Create contract record
      const { data: contract, error: contractError } = await supabase
        .from('contracts')
        .insert([{
          student_id: studentId,
          division: student.division,
          status: 'Draft',
          monthly_tuition: tuitionData,
          registration_fee: await getRegistrationFee(student.division as 'Professional' | 'Pre-Professional' | 'Supplemental'),
          season: template.season,
          contract_number: await generateContractNumber(),
          contract_start_date: new Date().toISOString().split('T')[0],
          contract_end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }])
        .select()
        .single();

      if (contractError) throw contractError;

      // Create document record
      const { data: document, error: documentError } = await supabase
        .from('documents')
        .insert([{
          student_id: studentId,
          title: `Contract - ${contractData.student_name} - ${template.season}`,
          html_content: generatedHtml,
          status: 'Draft'
        }])
        .select()
        .single();

      if (documentError) throw documentError;

      toast({
        title: "Success",
        description: "Contract generated successfully",
      });

      return { contract, document, html_content: generatedHtml };
    } catch (error) {
      console.error('Error generating contract:', error);
      toast({
        title: "Error",
        description: "Failed to generate contract",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getRegistrationFee = async (division: 'Professional' | 'Pre-Professional' | 'Supplemental') => {
    const { data, error } = await supabase
      .rpc('get_registration_fee', { div: division });
    if (error) throw error;
    return data;
  };

  const generateContractNumber = async () => {
    const { data, error } = await supabase
      .rpc('generate_contract_number');
    if (error) throw error;
    return data;
  };

  return {
    generateContract,
    loading
  };
};