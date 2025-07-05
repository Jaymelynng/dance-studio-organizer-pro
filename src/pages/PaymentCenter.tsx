import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  ArrowLeft, 
  DollarSign, 
  CreditCard, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Plus, 
  Search, 
  Filter,
  TrendingUp,
  TrendingDown,
  Calendar,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';

const PaymentCenter = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);

  // Fetch payments with student info
  const { data: payments, isLoading: paymentsLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          student:students(first_name, last_name, division),
          payment_schedule:payment_schedules(due_date, payment_type)
        `)
        .order('payment_date', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch payment schedules (overdue and upcoming)
  const { data: schedules, isLoading: schedulesLoading } = useQuery({
    queryKey: ['payment_schedules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_schedules')
        .select(`
          *,
          contract:contracts(
            student:students(first_name, last_name, division)
          )
        `)
        .order('due_date', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch students for payment recording
  const { data: students } = useQuery({
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

  // Record payment mutation
  const recordPaymentMutation = useMutation({
    mutationFn: async ({ studentId, amount, method, notes }: { studentId: string; amount: string; method: string; notes: string }) => {
      const { data, error } = await supabase
        .from('payments')
        .insert({
          student_id: studentId,
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
      setIsRecordPaymentOpen(false);
      setSelectedStudent('');
      setPaymentAmount('');
      setPaymentMethod('');
      setPaymentNotes('');
      toast({
        title: "Payment Recorded",
        description: "Payment has been successfully recorded",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to record payment",
        variant: "destructive",
      });
    }
  });

  const handleRecordPayment = () => {
    if (!selectedStudent || !paymentAmount || !paymentMethod) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    recordPaymentMutation.mutate({
      studentId: selectedStudent,
      amount: paymentAmount,
      method: paymentMethod,
      notes: paymentNotes
    });
  };

  // Calculate stats
  const calculateStats = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyTotal = payments?.reduce((sum, payment) => {
      const paymentDate = new Date(payment.payment_date!);
      if (paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear) {
        return sum + Number(payment.amount);
      }
      return sum;
    }, 0) || 0;

    const overdue = schedules?.filter(schedule => {
      const dueDate = new Date(schedule.due_date);
      return dueDate < new Date() && schedule.status === 'Pending';
    }).length || 0;

    const pendingAmount = schedules?.reduce((sum, schedule) => {
      if (schedule.status === 'Pending') {
        return sum + Number(schedule.amount);
      }
      return sum;
    }, 0) || 0;

    return { monthlyTotal, overdue, pendingAmount };
  };

  const stats = calculateStats();

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'status-active';
      case 'Pending': return 'status-pending';
      case 'Overdue': return 'status-inactive';
      case 'Partial': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-muted';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'Credit Card':
      case 'Square': return <CreditCard className="h-4 w-4" />;
      case 'Cash': return <DollarSign className="h-4 w-4" />;
      default: return <DollarSign className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getOverdueSchedules = () => {
    return schedules?.filter(schedule => {
      const dueDate = new Date(schedule.due_date);
      return dueDate < new Date() && schedule.status === 'Pending';
    }) || [];
  };

  const getUpcomingSchedules = () => {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    
    return schedules?.filter(schedule => {
      const dueDate = new Date(schedule.due_date);
      return dueDate >= today && dueDate <= thirtyDaysFromNow && schedule.status === 'Pending';
    }) || [];
  };

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
          
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white">Payment Center</h1>
            <p className="text-white/80">Manage tuition payments and financial records</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-success">
                    {formatCurrency(stats.monthlyTotal)}
                  </div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                </div>
                <TrendingUp className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-destructive">
                    {stats.overdue}
                  </div>
                  <p className="text-sm text-muted-foreground">Overdue</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-warning">
                    {formatCurrency(stats.pendingAmount)}
                  </div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
                <Clock className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {payments?.length || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Payments</p>
                </div>
                <CreditCard className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="payments" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="payments">Payment History</TabsTrigger>
            <TabsTrigger value="schedules">Payment Schedules</TabsTrigger>
            <TabsTrigger value="overdue">Overdue Payments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="payments" className="mt-6">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Payment History</CardTitle>
                    <CardDescription>All recorded payments and transactions</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search payments..." className="pl-10 w-64" />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4" />
                    </Button>
                    <Dialog open={isRecordPaymentOpen} onOpenChange={setIsRecordPaymentOpen}>
                      <DialogTrigger asChild>
                        <Button variant="elegant">
                          <Plus className="h-4 w-4 mr-2" />
                          Record Payment
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Record New Payment</DialogTitle>
                          <DialogDescription>
                            Record a payment received from a student
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">Student *</label>
                            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a student" />
                              </SelectTrigger>
                              <SelectContent>
                                {students?.map((student) => (
                                  <SelectItem key={student.id} value={student.id}>
                                    {student.first_name} {student.last_name} ({student.division})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Amount *</label>
                            <Input
                              type="number"
                              step="0.01"
                              value={paymentAmount}
                              onChange={(e) => setPaymentAmount(e.target.value)}
                              placeholder="0.00"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Payment Method *</label>
                            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select payment method" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Square">Square</SelectItem>
                                <SelectItem value="Venmo">Venmo</SelectItem>
                                <SelectItem value="Check">Check</SelectItem>
                                <SelectItem value="Cash">Cash</SelectItem>
                                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Notes</label>
                            <Textarea
                              value={paymentNotes}
                              onChange={(e) => setPaymentNotes(e.target.value)}
                              placeholder="Payment notes..."
                              rows={3}
                            />
                          </div>
                          <Button 
                            onClick={handleRecordPayment} 
                            disabled={recordPaymentMutation.isPending}
                            className="w-full"
                          >
                            {recordPaymentMutation.isPending ? "Recording..." : "Record Payment"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {paymentsLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="p-4 rounded-lg border">
                        <Skeleton className="h-4 w-64 mb-2" />
                        <Skeleton className="h-3 w-32 mb-2" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    ))}
                  </div>
                ) : payments && payments.length > 0 ? (
                  <div className="space-y-4">
                    {payments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-smooth">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            {getPaymentMethodIcon(payment.payment_method || '')}
                            <p className="font-medium">
                              {payment.student ? `${payment.student.first_name} ${payment.student.last_name}` : 'Unknown Student'}
                            </p>
                            <Badge variant="outline">{payment.student?.division}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {payment.payment_method} • {new Date(payment.payment_date!).toLocaleDateString()}
                          </p>
                          {payment.notes && (
                            <p className="text-xs text-muted-foreground">{payment.notes}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-success">
                            {formatCurrency(Number(payment.amount))}
                          </div>
                          {payment.late_fee && Number(payment.late_fee) > 0 && (
                            <div className="text-sm text-destructive">
                              +{formatCurrency(Number(payment.late_fee))} late fee
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No payments recorded yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedules" className="mt-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Payment Schedules</CardTitle>
                <CardDescription>Upcoming and scheduled payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Upcoming Payments */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Upcoming (Next 30 Days)
                    </h3>
                    {getUpcomingSchedules().length > 0 ? (
                      <div className="space-y-2">
                        {getUpcomingSchedules().map((schedule) => (
                          <div key={schedule.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">
                                {schedule.contract?.student ? 
                                  `${schedule.contract.student.first_name} ${schedule.contract.student.last_name}` : 
                                  'Unknown Student'
                                }
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {schedule.payment_type} • Due {new Date(schedule.due_date).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">{formatCurrency(Number(schedule.amount))}</div>
                              <Badge className={getPaymentStatusColor(schedule.status || 'Pending')}>
                                {schedule.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No upcoming payments</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overdue" className="mt-6">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-destructive">Overdue Payments</CardTitle>
                    <CardDescription>Payments that are past due</CardDescription>
                  </div>
                  <Button variant="destructive" size="sm">
                    Send Reminders
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {getOverdueSchedules().length > 0 ? (
                  <div className="space-y-4">
                    {getOverdueSchedules().map((schedule) => (
                      <div key={schedule.id} className="flex items-center justify-between p-4 border-l-4 border-destructive bg-destructive/5 rounded-lg">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-destructive" />
                            <p className="font-medium">
                              {schedule.contract?.student ? 
                                `${schedule.contract.student.first_name} ${schedule.contract.student.last_name}` : 
                                'Unknown Student'
                              }
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {schedule.payment_type} • Due {new Date(schedule.due_date).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-destructive">
                            {Math.floor((new Date().getTime() - new Date(schedule.due_date).getTime()) / (1000 * 60 * 60 * 24))} days overdue
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-destructive">
                            {formatCurrency(Number(schedule.amount))}
                          </div>
                          <div className="flex gap-2 mt-2">
                            <Button variant="outline" size="sm">
                              Contact Parent
                            </Button>
                            <Button variant="outline" size="sm">
                              Record Payment
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
                    <p className="text-muted-foreground">No overdue payments</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PaymentCenter;