import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePayments, usePaymentSchedules } from '@/hooks/usePaymentCenter';
import { calculatePaymentStats } from '@/components/payment-center/utils';
import PaymentStatsCards from '@/components/payment-center/PaymentStatsCards';
import PaymentHistoryTab from '@/components/payment-center/PaymentHistoryTab';
import PaymentSchedulesTab from '@/components/payment-center/PaymentSchedulesTab';
import OverduePaymentsTab from '@/components/payment-center/OverduePaymentsTab';

const PaymentCenter = () => {
  const navigate = useNavigate();
  const { data: payments, isLoading: paymentsLoading } = usePayments();
  const { data: schedules } = usePaymentSchedules();
  
  const stats = calculatePaymentStats(payments || [], schedules || []);

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Payment Center</h1>
              <p className="text-white/80">Manage tuition payments and financial records</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/payment-settings')}
              className="mt-4 sm:mt-0"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        <PaymentStatsCards 
          monthlyTotal={stats.monthlyTotal}
          overdue={stats.overdue}
          pendingAmount={stats.pendingAmount}
          totalPayments={payments?.length || 0}
        />
        
        <Tabs defaultValue="payments" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto p-1">
            <TabsTrigger value="payments" className="text-xs sm:text-sm py-2 sm:py-3">
              <span className="hidden sm:inline">Payment History</span>
              <span className="sm:hidden">History</span>
            </TabsTrigger>
            <TabsTrigger value="schedules" className="text-xs sm:text-sm py-2 sm:py-3">
              <span className="hidden sm:inline">Payment Schedules</span>
              <span className="sm:hidden">Schedules</span>
            </TabsTrigger>
            <TabsTrigger value="overdue" className="text-xs sm:text-sm py-2 sm:py-3">
              <span className="hidden sm:inline">Overdue Payments</span>
              <span className="sm:hidden">Overdue</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="payments" className="mt-6">
            <PaymentHistoryTab 
              payments={payments || []}
              isLoading={paymentsLoading}
            />
          </TabsContent>

          <TabsContent value="schedules" className="mt-6">
            <PaymentSchedulesTab schedules={schedules || []} />
          </TabsContent>

          <TabsContent value="overdue" className="mt-6">
            <OverduePaymentsTab schedules={schedules || []} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PaymentCenter;