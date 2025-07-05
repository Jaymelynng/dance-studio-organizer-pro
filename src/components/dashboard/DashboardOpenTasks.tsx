import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Clock
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTaskIcon, getUrgencyColor } from "@/lib/dashboard-helpers";
import { formatDate } from "@/lib/dashboard-utils";

interface OpenTask {
  id: string;
  type: 'signature' | 'payment' | 'document';
  title: string;
  description: string;
  urgency: 'low' | 'medium' | 'high';
  student_name?: string;
  contract_id?: string;
  due_date?: string;
  created_at: string;
}

interface DashboardOpenTasksProps {
  openTasks: OpenTask[];
  tasksLoading: boolean;
}

const DashboardOpenTasks = ({ openTasks, tasksLoading }: DashboardOpenTasksProps) => {
  const [tasksCollapsed, setTasksCollapsed] = useState(false);
  const navigate = useNavigate();

  if (openTasks.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-card border-l-4 border-l-warning/30">
      <Collapsible open={!tasksCollapsed}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-warning" />
                Open Tasks
              </CardTitle>
              <CardDescription className="text-sm">
                {openTasks.length} items requiring attention
              </CardDescription>
            </div>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTasksCollapsed(!tasksCollapsed)}
              >
                {tasksCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="space-y-2 pt-0">
            {tasksLoading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="flex items-start gap-3 p-2 rounded border">
                  <Skeleton className="h-3 w-3 mt-1" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-2 w-16" />
                  </div>
                </div>
              ))
            ) : (
              openTasks.slice(0, 3).map((task) => (
                <div key={task.id} className="flex items-start gap-2 p-2 rounded border hover:bg-muted/30 transition-smooth">
                  <div className="flex-shrink-0 mt-0.5">
                    {getTaskIcon(task.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-medium">{task.title}</p>
                        <p className="text-xs text-muted-foreground">{task.description}</p>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`text-xs h-4 ${getUrgencyColor(task.urgency)}`}
                      >
                        {task.urgency}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => {
                          if (task.type === 'signature' || task.type === 'document') {
                            navigate('/contracts');
                          } else if (task.type === 'payment') {
                            navigate('/payments');
                          }
                        }}
                      >
                        Action
                      </Button>
                      {task.due_date && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(task.due_date)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            {openTasks.length > 3 && (
              <div className="pt-2 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs h-6"
                  onClick={() => navigate('/contracts')}
                >
                  View All {openTasks.length} Tasks
                </Button>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default DashboardOpenTasks;