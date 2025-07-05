import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  UserCheck, 
  DollarSign, 
  FileText, 
  MessageSquare,
  Calendar,
  Search,
  Filter,
  Clock
} from "lucide-react";
import { useActivities } from "@/hooks/useActivities";
import { Skeleton } from "@/components/ui/skeleton";

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const ActivityFeed = () => {
  const { activities, loading } = useActivities();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "enrollment":
        return <UserCheck className="h-4 w-4 text-success" />;
      case "payment":
        return <DollarSign className="h-4 w-4 text-success" />;
      case "contract":
        return <FileText className="h-4 w-4 text-warning" />;
      case "communication":
        return <MessageSquare className="h-4 w-4 text-primary" />;
      case "document":
        return <FileText className="h-4 w-4 text-info" />;
      case "system":
        return <Clock className="h-4 w-4 text-muted-foreground" />;
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "status-active";
      case "pending":
        return "status-pending";
      case "failed":
        return "status-inactive";
      default:
        return "bg-muted";
    }
  };

  // Extended mock activities for demonstration
  const extendedActivities = [
    ...activities,
    {
      id: "mock-1",
      type: "communication" as const,
      description: "Sent monthly newsletter to 45 parents",
      status: "success",
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "mock-2", 
      type: "document" as const,
      description: "Medical forms updated for 3 students",
      status: "success",
      created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "mock-3",
      type: "system" as const,
      description: "Automated payment reminders sent",
      status: "success", 
      created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
    }
  ];

  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Recent Activity
          </CardTitle>
          <Badge variant="outline">{extendedActivities.length}</Badge>
        </div>
        <div className="flex gap-2 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search activities..." className="pl-10" />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 max-h-96 overflow-y-auto">
        {loading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg border">
              <Skeleton className="h-4 w-4 mt-1" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))
        ) : extendedActivities.length > 0 ? (
          extendedActivities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-smooth">
              <div className="flex-shrink-0 mt-1">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">{activity.description}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={getStatusColor(activity.status || 'pending')}>
                    {activity.status}
                  </Badge>
                  {activity.created_at && (
                    <span className="text-xs text-muted-foreground">
                      {formatDate(activity.created_at)}
                    </span>
                  )}
                </div>
              </div>
              <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                View
              </Button>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No recent activity</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};