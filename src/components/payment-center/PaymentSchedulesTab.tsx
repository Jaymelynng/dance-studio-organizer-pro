import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { getPaymentStatusColor, formatCurrency, getUpcomingSchedules } from './utils';

interface PaymentSchedulesTabProps {
  schedules: any[];
}

const PaymentSchedulesTab = ({ schedules }: PaymentSchedulesTabProps) => {
  const upcomingSchedules = getUpcomingSchedules(schedules);

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Payment Schedules</CardTitle>
        <CardDescription>Upcoming and scheduled payments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming (Next 30 Days)
            </h3>
            {upcomingSchedules.length > 0 ? (
              <div className="space-y-3">
                {upcomingSchedules.map((schedule) => (
                  <div key={schedule.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg gap-3">
                    <div className="flex-1">
                      <p className="font-medium">
                        {schedule.contract?.student ? 
                          `${schedule.contract.student.first_name} ${schedule.contract.student.last_name}` : 
                          'Unknown Student'
                        }
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {schedule.category?.name || schedule.payment_type} • Due {new Date(schedule.due_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{formatCurrency(Number(schedule.amount))}</div>
                      <Badge className={getPaymentStatusColor(schedule.status || 'Pending')} variant="outline">
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
  );
};

export default PaymentSchedulesTab;