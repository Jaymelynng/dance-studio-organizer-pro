import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  Clock, 
  DollarSign, 
  FileText, 
  Calendar,
  CheckCircle,
  X
} from "lucide-react";

export const NotificationCenter = () => {
  const alerts = [
    {
      id: 1,
      type: "payment",
      title: "Overdue Payment",
      message: "3 students have overdue payments totaling $4,200",
      priority: "high",
      icon: DollarSign,
      action: "Review Payments"
    },
    {
      id: 2,
      type: "contract",
      title: "Contract Renewals",
      message: "5 contracts expire within 30 days",
      priority: "medium",
      icon: FileText,
      action: "Review Contracts"
    },
    {
      id: 3,
      type: "schedule",
      title: "Schedule Conflict",
      message: "2 classes have scheduling conflicts next week",
      priority: "medium",
      icon: Calendar,
      action: "Resolve Conflicts"
    },
    {
      id: 4,
      type: "document",
      title: "Missing Documents",
      message: "4 students missing medical clearance forms",
      priority: "low",
      icon: AlertTriangle,
      action: "Follow Up"
    }
  ];

  const reminders = [
    {
      id: 1,
      title: "Monthly Report Due",
      message: "Financial report due in 3 days",
      dueDate: "Dec 15",
      icon: Clock
    },
    {
      id: 2,
      title: "Parent Meeting",
      message: "Quarterly parent meeting scheduled",
      dueDate: "Dec 20",
      icon: Calendar
    },
    {
      id: 3,
      title: "Equipment Maintenance",
      message: "Studio equipment inspection due",
      dueDate: "Dec 22",
      icon: CheckCircle
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive text-destructive-foreground";
      case "medium":
        return "bg-warning text-warning-foreground";
      case "low":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Alerts */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Alerts & Issues
            </CardTitle>
            <Badge variant="destructive">{alerts.length}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-smooth">
              <alert.icon className="h-4 w-4 mt-1 text-muted-foreground" />
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm">{alert.title}</p>
                  <Badge className={getPriorityColor(alert.priority)} variant="secondary">
                    {alert.priority}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{alert.message}</p>
                <Button variant="outline" size="sm" className="mt-2">
                  {alert.action}
                </Button>
              </div>
              <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Reminders */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Upcoming Reminders
            </CardTitle>
            <Badge variant="outline">{reminders.length}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {reminders.map((reminder) => (
            <div key={reminder.id} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-smooth">
              <reminder.icon className="h-4 w-4 mt-1 text-muted-foreground" />
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">{reminder.title}</p>
                  <Badge variant="outline" className="text-xs">
                    {reminder.dueDate}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{reminder.message}</p>
              </div>
              <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
                <CheckCircle className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};