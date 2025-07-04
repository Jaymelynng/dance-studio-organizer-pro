import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalStudents: number;
  activeContracts: number;
  pendingPayments: number;
  monthlyRevenue: number;
  loading: boolean;
  error: string | null;
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    activeContracts: 0,
    pendingPayments: 0,
    monthlyRevenue: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStats(prev => ({ ...prev, loading: true, error: null }));

        // Fetch total students
        const { data: students, error: studentsError } = await supabase
          .from('students')
          .select('id, division, status');

        if (studentsError) throw studentsError;

        // Fetch active contracts
        const { data: contracts, error: contractsError } = await supabase
          .from('contracts')
          .select('id, status, monthly_tuition')
          .in('status', ['Signed', 'Active']);

        if (contractsError) throw contractsError;

        // Fetch pending payments
        const { data: pendingPayments, error: paymentsError } = await supabase
          .from('payment_schedules')
          .select('id')
          .in('status', ['Pending', 'Overdue']);

        if (paymentsError) throw paymentsError;

        // Calculate monthly revenue from active contracts
        const monthlyRevenue = contracts?.reduce((total, contract) => {
          return total + (contract.monthly_tuition || 0);
        }, 0) || 0;

        setStats({
          totalStudents: students?.length || 0,
          activeContracts: contracts?.length || 0,
          pendingPayments: pendingPayments?.length || 0,
          monthlyRevenue,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setStats(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'An error occurred',
        }));
      }
    };

    fetchStats();
  }, []);

  return stats;
};