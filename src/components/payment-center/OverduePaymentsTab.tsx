import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { formatCurrency, getOverdueSchedules } from './utils';

interface OverduePaymentsTabProps {
  schedules: any[];
}

const OverduePaymentsTab = ({ schedules }: OverduePaymentsTabProps) => {
  const overdueSchedules = getOverdueSchedules(schedules);

  return (
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
        {overdueSchedules.length > 0 ? (
          <div className="space-y-4">
            {overdueSchedules.map((schedule) => (
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
  );
};

export default OverduePaymentsTab;