import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OpenTask {
  id: string;
  type: 'signature' | 'payment' | 'document';
  title: string;
  description: string;
  urgency: 'low' | 'medium' | 'high';
  student_name?: string;
  contract_id?: string;
  due_date?: string;
  created_at: string;
}

export const useOpenTasks = () => {
  const [tasks, setTasks] = useState<OpenTask[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchOpenTasks = async () => {
    setLoading(true);
    try {
      const openTasks: OpenTask[] = [];

      // Fetch contracts with missing signatures
      const { data: contracts, error: contractsError } = await supabase
        .from('contracts')
        .select(`
          id,
          contract_number,
          parent_signature_date,
          student_signature_date,
          director_signature_date,
          created_at,
          students (
            first_name,
            last_name
          )
        `)
        .or('parent_signature_date.is.null,student_signature_date.is.null,director_signature_date.is.null');

      if (contractsError) throw contractsError;

      contracts?.forEach((contract) => {
        const studentName = `${contract.students?.first_name} ${contract.students?.last_name}`;
        
        if (!contract.parent_signature_date) {
          openTasks.push({
            id: `parent-sig-${contract.id}`,
            type: 'signature',
            title: 'Parent Signature Missing',
            description: `Contract ${contract.contract_number} needs parent signature`,
            urgency: 'high',
            student_name: studentName,
            contract_id: contract.id,
            created_at: contract.created_at
          });
        }

        if (!contract.student_signature_date) {
          openTasks.push({
            id: `student-sig-${contract.id}`,
            type: 'signature',
            title: 'Student Signature Missing',
            description: `Contract ${contract.contract_number} needs student signature`,
            urgency: 'medium',
            student_name: studentName,
            contract_id: contract.id,
            created_at: contract.created_at
          });
        }

        if (!contract.director_signature_date) {
          openTasks.push({
            id: `director-sig-${contract.id}`,
            type: 'signature',
            title: 'Director Signature Missing',
            description: `Contract ${contract.contract_number} needs director signature`,
            urgency: 'medium',
            student_name: studentName,
            contract_id: contract.id,
            created_at: contract.created_at
          });
        }
      });

      // Fetch overdue payments
      const { data: overduePayments, error: paymentsError } = await supabase
        .from('payment_schedules')
        .select(`
          id,
          amount,
          due_date,
          payment_type,
          contracts (
            id,
            contract_number,
            students (
              first_name,
              last_name
            )
          )
        `)
        .eq('status', 'Overdue');

      if (paymentsError) throw paymentsError;

      overduePayments?.forEach((payment) => {
        const studentName = payment.contracts?.students ? 
          `${payment.contracts.students.first_name} ${payment.contracts.students.last_name}` : 
          'Unknown Student';

        openTasks.push({
          id: `payment-${payment.id}`,
          type: 'payment',
          title: 'Overdue Payment',
          description: `$${payment.amount} ${payment.payment_type} overdue for ${studentName}`,
          urgency: 'high',
          student_name: studentName,
          due_date: payment.due_date,
          created_at: payment.due_date
        });
      });

      // Fetch pending documents
      const { data: pendingDocs, error: docsError } = await supabase
        .from('documents')
        .select(`
          id,
          title,
          status,
          created_at,
          students (
            first_name,
            last_name
          )
        `)
        .in('status', ['Draft', 'Sent']);

      if (docsError) throw docsError;

      pendingDocs?.forEach((doc) => {
        const studentName = doc.students ? 
          `${doc.students.first_name} ${doc.students.last_name}` : 
          'Unknown Student';

        openTasks.push({
          id: `doc-${doc.id}`,
          type: 'document',
          title: 'Document Pending',
          description: `${doc.title} - ${doc.status} for ${studentName}`,
          urgency: doc.status === 'Sent' ? 'medium' : 'low',
          student_name: studentName,
          created_at: doc.created_at
        });
      });

      // Sort by urgency and creation date
      const urgencyOrder = { high: 3, medium: 2, low: 1 };
      openTasks.sort((a, b) => {
        if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
          return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      setTasks(openTasks);
    } catch (error) {
      console.error('Error fetching open tasks:', error);
      toast({
        title: "Error",
        description: "Failed to fetch open tasks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpenTasks();
  }, []);

  return {
    tasks,
    loading,
    refetch: fetchOpenTasks
  };
};