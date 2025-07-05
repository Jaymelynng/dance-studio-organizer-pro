import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-picker';
import { DollarSign, TrendingUp, TrendingDown, Download, Calendar, CreditCard, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DateRange } from 'react-day-picker';
import { addDays, startOfMonth, endOfMonth } from 'date-fns';

export const FinancialReportsTab = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date())
  });
  const [division, setDivision] = useState<string>('all');

  // Fetch financial data
  const { data: financialData, isLoading } = useQuery({
    queryKey: ['financial-reports', dateRange, division],
    queryFn: async () => {
      const fromDate = dateRange?.from?.toISOString().split('T')[0];
      const toDate = dateRange?.to?.toISOString().split('T')[0];

      // Get payments data
      let paymentsQuery = supabase
        .from('payments')
        .select(`
          *,
          student:students(
            first_name,
            last_name,
            division,
            parent:parents(first_name, last_name, email)
          )
        `);

      if (fromDate) paymentsQuery = paymentsQuery.gte('payment_date', fromDate);
      if (toDate) paymentsQuery = paymentsQuery.lte('payment_date', toDate);

      const { data: payments } = await paymentsQuery;

      // Get payment schedules (pending/overdue)
      let schedulesQuery = supabase
        .from('payment_schedules')
        .select(`
          *,
          contract:contracts(
            student:students(
              first_name,
              last_name,
              division,
              parent:parents(first_name, last_name, email)
            ),
            monthly_tuition,
            registration_fee
          )
        `)
        .eq('status', 'Pending');

      if (fromDate) schedulesQuery = schedulesQuery.gte('due_date', fromDate);
      if (toDate) schedulesQuery = schedulesQuery.lte('due_date', toDate);

      const { data: pendingPayments } = await schedulesQuery;

      // Get contracts for revenue calculation
      let contractsQuery = supabase
        .from('contracts')
        .select(`
          *,
          student:students(
            first_name,
            last_name,
            division,
            parent:parents(first_name, last_name, email)
          )
        `)
        .eq('status', 'Active');

      if (division !== 'all') {
        contractsQuery = contractsQuery.eq('division', division as any);
      }

      const { data: contracts } = await contractsQuery;

      return {
        payments: payments || [],
        pendingPayments: pendingPayments || [],
        contracts: contracts || []
      };
    }
  });

  const calculateMetrics = () => {
    if (!financialData) return {
      totalRevenue: 0,
      totalReceived: 0,
      totalPending: 0,
      overdueAmount: 0,
      monthlyRecurring: 0
    };

    const totalReceived = financialData.payments.reduce((sum, payment) => sum + payment.amount, 0);
    const totalPending = financialData.pendingPayments.reduce((sum, schedule) => sum + schedule.amount, 0);
    const overdueAmount = financialData.pendingPayments
      .filter(schedule => new Date(schedule.due_date) < new Date())
      .reduce((sum, schedule) => sum + schedule.amount, 0);
    const monthlyRecurring = financialData.contracts.reduce((sum, contract) => sum + contract.monthly_tuition, 0);

    return {
      totalRevenue: totalReceived + totalPending,
      totalReceived,
      totalPending,
      overdueAmount,
      monthlyRecurring
    };
  };

  const metrics = calculateMetrics();

  const exportReport = () => {
    // Create CSV content
    const csvContent = [
      ['Financial Report'],
      ['Generated:', new Date().toLocaleDateString()],
      ['Period:', `${dateRange?.from?.toLocaleDateString()} - ${dateRange?.to?.toLocaleDateString()}`],
      [],
      ['Summary'],
      ['Total Revenue', `$${metrics.totalRevenue.toFixed(2)}`],
      ['Total Received', `$${metrics.totalReceived.toFixed(2)}`],
      ['Total Pending', `$${metrics.totalPending.toFixed(2)}`],
      ['Overdue Amount', `$${metrics.overdueAmount.toFixed(2)}`],
      ['Monthly Recurring', `$${metrics.monthlyRecurring.toFixed(2)}`],
      [],
      ['Payment Details'],
      ['Date', 'Student', 'Division', 'Amount', 'Method', 'Status']
    ];

    financialData?.payments.forEach(payment => {
      csvContent.push([
        payment.payment_date || '',
        `${payment.student?.first_name} ${payment.student?.last_name}`,
        payment.student?.division || '',
        `$${payment.amount.toFixed(2)}`,
        payment.payment_method || '',
        'Paid'
      ]);
    });

    const csv = csvContent.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `financial-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Financial Reports</h2>
          <p className="text-white/70">Revenue, payments, and financial analytics</p>
        </div>
        <div className="flex gap-4">
          <Select value={division} onValueChange={setDivision}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Divisions</SelectItem>
              <SelectItem value="Professional">Professional</SelectItem>
              <SelectItem value="Pre-Professional">Pre-Professional</SelectItem>
              <SelectItem value="Supplemental">Supplemental</SelectItem>
            </SelectContent>
          </Select>
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          <Button onClick={exportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              ${metrics.totalRevenue.toFixed(0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Received + Pending
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collected</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              ${metrics.totalReceived.toFixed(0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Payments received
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Calendar className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              ${metrics.totalPending.toFixed(0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting payment
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              ${metrics.overdueAmount.toFixed(0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Past due date
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Recurring</CardTitle>
            <CreditCard className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              ${metrics.monthlyRecurring.toFixed(0)}
            </div>
            <p className="text-xs text-muted-foreground">
              From active contracts
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Payments */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse flex justify-between items-center p-3 border rounded">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                ))
              ) : financialData?.payments.length ? (
                financialData.payments.slice(0, 5).map((payment) => (
                  <div key={payment.id} className="flex justify-between items-center p-3 border rounded hover:bg-muted/50">
                    <div>
                      <p className="font-medium">
                        {payment.student?.first_name} {payment.student?.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {payment.payment_date ? new Date(payment.payment_date).toLocaleDateString() : 'No date'}
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-success/10 text-success">
                      ${payment.amount.toFixed(0)}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-8">No payments in selected period</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Overdue Payments */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Overdue Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse flex justify-between items-center p-3 border rounded">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                ))
              ) : financialData?.pendingPayments.filter(p => new Date(p.due_date) < new Date()).length ? (
                financialData.pendingPayments
                  .filter(p => new Date(p.due_date) < new Date())
                  .slice(0, 5)
                  .map((schedule) => (
                    <div key={schedule.id} className="flex justify-between items-center p-3 border rounded hover:bg-muted/50">
                      <div>
                        <p className="font-medium">
                          {schedule.contract?.student?.first_name} {schedule.contract?.student?.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Due: {new Date(schedule.due_date).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="outline" className="bg-destructive/10 text-destructive">
                        ${schedule.amount.toFixed(0)}
                      </Badge>
                    </div>
                  ))
              ) : (
                <p className="text-muted-foreground text-center py-8">No overdue payments</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};