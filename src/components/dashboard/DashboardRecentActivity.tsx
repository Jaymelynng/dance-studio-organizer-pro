import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useState } from "react";
import { getActivityIcon } from "@/lib/dashboard-helpers";
import { formatDate } from "@/lib/dashboard-utils";

interface Activity {
  id: string;
  type: string;
  description: string;
  status: string;
  created_at: string | null;
}

interface DashboardRecentActivityProps {
  activities: Activity[];
  activitiesLoading: boolean;
}

const DashboardRecentActivity = ({ activities, activitiesLoading }: DashboardRecentActivityProps) => {
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [activityCollapsed, setActivityCollapsed] = useState(false);

  return (
    <Card className="shadow-card">
      <Collapsible open={!activityCollapsed}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              {!activitiesLoading && activities.length > 0 && (
                <CardDescription>
                  {activities.length} activities • {activities.filter(a => a.created_at && new Date(a.created_at).toDateString() === new Date().toDateString()).length} today
                </CardDescription>
              )}
            </div>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActivityCollapsed(!activityCollapsed)}
              >
                {activityCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="space-y-2 pt-0">
            {activitiesLoading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="flex items-start gap-2 p-2 rounded border">
                  <Skeleton className="h-3 w-3 mt-1" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-2 w-16" />
                  </div>
                </div>
              ))
            ) : activities.length > 0 ? (
              <>
                {(showAllActivities ? activities : activities.slice(0, 5)).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-2 p-2 rounded hover:bg-muted/30 transition-smooth">
                    <div className="flex-shrink-0 mt-0.5">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs leading-relaxed truncate">{activity.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={`text-xs h-4 ${activity.status === 'success' ? 'status-active' : 'status-pending'}`}>
                          {activity.status}
                        </Badge>
                        {activity.created_at && (
                          <span className="text-xs text-muted-foreground">
                            {formatDate(activity.created_at)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {activities.length > 5 && (
                  <div className="pt-2 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-xs h-8"
                      onClick={() => setShowAllActivities(!showAllActivities)}
                    >
                      {showAllActivities ? 'Show Less' : `Show ${activities.length - 5} More`}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground text-sm">No recent activity</p>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default DashboardRecentActivity;