import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Users, 
  UserCheck, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Plus,
  Search,
  Filter,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Clock,
  CheckCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useStudents } from "@/hooks/useStudents";
import { useActivities } from "@/hooks/useActivities";
import { useOpenTasks } from "@/hooks/useOpenTasks";
import { EmptyState } from "@/components/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { GlobalSearch } from "@/components/GlobalSearch";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const Dashboard = () => {
  const navigate = useNavigate();
  const stats = useDashboardStats();
  const { students, loading: studentsLoading } = useStudents();
  const { activities, loading: activitiesLoading } = useActivities();
  const { tasks: openTasks, loading: tasksLoading } = useOpenTasks();
  
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [activityCollapsed, setActivityCollapsed] = useState(false);
  const [tasksCollapsed, setTasksCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const getDivisionColor = (division: string) => {
    switch (division) {
      case "Professional":
        return "division-professional";
      case "Pre-Professional":
        return "division-pre-professional";
      case "Supplemental":
        return "division-supplemental";
      default:
        return "bg-muted";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "status-active";
      case "Pending":
        return "status-pending";
      case "Inactive":
        return "status-inactive";
      default:
        return "bg-muted";
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case "signature":
        return <FileText className="h-4 w-4 text-warning" />;
      case "payment":
        return <DollarSign className="h-4 w-4 text-destructive" />;
      case "document":
        return <FileText className="h-4 w-4 text-primary" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "enrollment":
        return <UserCheck className="h-4 w-4 text-success" />;
      case "payment":
        return <DollarSign className="h-4 w-4 text-success" />;
      case "contract":
        return <FileText className="h-4 w-4 text-warning" />;
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "text-destructive border-destructive bg-destructive/10";
      case "medium":
        return "text-warning border-warning bg-warning/10";
      case "low":
        return "text-muted-foreground border-muted-foreground bg-muted/10";
      default:
        return "text-muted-foreground";
    }
  };

  if (stats.loading) {
    return (
    <div className="min-h-screen bg-gradient-hero">
        <div className="container mx-auto p-6 space-y-8">
          <div className="text-center space-y-4 py-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Dégagé Classical Conservatory
            </h1>
            <p className="text-white/90 text-lg">Management Dashboard</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="shadow-card">
                <CardContent className="p-6">
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show empty state for new studio
  if (stats.totalStudents === 0 && !stats.loading) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <div className="container mx-auto p-6 space-y-8">
          <div className="text-center space-y-4 py-8">
            <h1 className="text-4xl font-bold text-white mb-2 animate-float">
              Dégagé Classical Conservatory
            </h1>
            <p className="text-white/90 text-lg">Management Dashboard</p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <EmptyState
              title="Welcome to Your Studio"
              description="Ready to begin your journey? Start by adding your first student to bring your conservatory to life."
              actionLabel="Add First Student"
              onAction={() => navigate('/enroll')}
              icon={<GraduationCap className="h-12 w-12 text-primary" />}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <h1 className="text-4xl font-bold text-white mb-2 animate-float">
            Dégagé Classical Conservatory
          </h1>
          <p className="text-white/90 text-lg">
            Management Dashboard
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-card hover:shadow-elegant transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                Active enrollment
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elegant transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Contracts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.activeContracts}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeContracts}/{stats.totalStudents} signed
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elegant transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              <DollarSign className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{stats.pendingPayments}</div>
              <p className="text-xs text-muted-foreground">
                {stats.pendingPayments > 0 ? 'Requires follow-up' : 'All current'}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elegant transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {formatCurrency(stats.monthlyRevenue)}
              </div>
              <p className="text-xs text-muted-foreground">
                From active contracts
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Open Tasks Section */}
        {openTasks.length > 0 && (
          <Card className="shadow-card border-l-4 border-l-warning">
            <Collapsible open={!tasksCollapsed}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-warning" />
                      Open Tasks & Action Items
                    </CardTitle>
                    <CardDescription>
                      {openTasks.length} tasks requiring attention
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
                <CardContent className="space-y-3 pt-0">
                  {tasksLoading ? (
                    [...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded border">
                        <Skeleton className="h-4 w-4 mt-1" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    ))
                  ) : (
                    openTasks.slice(0, 5).map((task) => (
                      <div key={task.id} className="flex items-start gap-3 p-3 rounded border hover:bg-muted/30 transition-smooth">
                        <div className="flex-shrink-0 mt-0.5">
                          {getTaskIcon(task.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-medium text-sm">{task.title}</p>
                              <p className="text-xs text-muted-foreground">{task.description}</p>
                              {task.student_name && (
                                <p className="text-xs text-primary mt-1">Student: {task.student_name}</p>
                              )}
                            </div>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getUrgencyColor(task.urgency)}`}
                            >
                              {task.urgency}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
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
                              Take Action
                            </Button>
                            {task.due_date && (
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Due {formatDate(task.due_date)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  {openTasks.length > 5 && (
                    <div className="pt-2 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-xs h-8"
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
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Student Management */}
          <Card className="shadow-card lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Student Management</CardTitle>
                  <CardDescription>Recent enrollments and student status</CardDescription>
                </div>
                <Button variant="elegant" size="sm" onClick={() => navigate('/enroll')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              </div>
              <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search everything..." 
                  className="pl-10 cursor-pointer" 
                  onClick={() => setIsSearchOpen(true)}
                  readOnly
                />
              </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {studentsLoading ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="p-3 rounded-lg border">
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-24 mb-2" />
                    <div className="flex gap-2">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                  </div>
                ))
              ) : students.length > 0 ? (
                students.slice(0, 3).map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-smooth">
                    <div className="space-y-1">
                      <p className="font-medium">{student.first_name} {student.last_name}</p>
                      <p className="text-sm text-muted-foreground">
                        Parent: {student.parent?.first_name} {student.parent?.last_name}
                      </p>
                      <div className="flex gap-2">
                        <Badge className={getDivisionColor(student.division)}>
                          {student.division}
                        </Badge>
                        <Badge variant="outline" className={getStatusColor(student.status || 'Pending')}>
                          {student.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/students/${student.id}`)}
                      >
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No students enrolled yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
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
        </div>

        {/* Quick Actions */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="professional" className="h-16 flex-col gap-2" onClick={() => navigate('/enroll')}>
                <Plus className="h-5 w-5" />
                <span className="text-xs">New Student</span>
              </Button>
              <Button variant="professional" className="h-16 flex-col gap-2" onClick={() => navigate('/contracts')}>
                <FileText className="h-5 w-5" />
                <span className="text-xs">Contract Management</span>
              </Button>
              <Button variant="professional" className="h-16 flex-col gap-2" onClick={() => navigate('/communications')}>
                <DollarSign className="h-5 w-5" />
                <span className="text-xs">Payment Reminder</span>
              </Button>
              <Button variant="professional" className="h-16 flex-col gap-2" onClick={() => navigate('/templates')}>
                <FileText className="h-5 w-5" />
                <span className="text-xs">Template Center</span>
              </Button>
              <Button variant="professional" className="h-16 flex-col gap-2" onClick={() => navigate('/reports')}>
                <Calendar className="h-5 w-5" />
                <span className="text-xs">Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      </div>
    </div>
  );
};

export default Dashboard;