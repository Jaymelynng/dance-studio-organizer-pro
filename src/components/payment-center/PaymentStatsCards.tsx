import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, AlertTriangle, Clock, CreditCard } from 'lucide-react';
import { formatCurrency } from './utils';

interface PaymentStatsCardsProps {
  monthlyTotal: number;
  overdue: number;
  pendingAmount: number;
  totalPayments: number;
}

const PaymentStatsCards = ({ monthlyTotal, overdue, pendingAmount, totalPayments }: PaymentStatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-success">
                {formatCurrency(monthlyTotal)}
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
                {overdue}
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
                {formatCurrency(pendingAmount)}
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
                {totalPayments}
              </div>
              <p className="text-sm text-muted-foreground">Total Payments</p>
            </div>
            <CreditCard className="h-8 w-8 text-primary" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentStatsCards;