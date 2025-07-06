import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Filter, CreditCard } from 'lucide-react';
import { getPaymentMethodIcon, formatCurrency } from './utils';
import RecordPaymentDialog from './RecordPaymentDialog';

interface PaymentHistoryTabProps {
  payments: any[];
  isLoading: boolean;
}

const PaymentHistoryTab = ({ payments, isLoading }: PaymentHistoryTabProps) => {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>All recorded payments and transactions</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search payments..." className="pl-10 sm:w-64" />
            </div>
            <Button variant="outline" size="sm" className="min-h-[40px]">
              <Filter className="h-4 w-4" />
            </Button>
            <RecordPaymentDialog />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
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
  );
};

export default PaymentHistoryTab;