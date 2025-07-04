import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  UserCheck, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Plus,
  Search,
  Filter
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface DashboardStats {
  totalStudents: number;
  activeContracts: number;
  pendingPayments: number;
  revenue: number;
}

interface Student {
  id: string;
  name: string;
  division: "Professional" | "Pre-Professional" | "Supplemental";
  status: "Active" | "Pending" | "Inactive";
  parentName: string;
  monthlyTuition: number;
}

interface RecentActivity {
  id: string;
  type: "enrollment" | "payment" | "contract";
  description: string;
  timestamp: string;
  status: "success" | "pending" | "warning";
}

const mockStats: DashboardStats = {
  totalStudents: 47,
  activeContracts: 42,
  pendingPayments: 8,
  revenue: 12500
};

const mockStudents: Student[] = [
  {
    id: "1",
    name: "Emma Beaumont",
    division: "Professional",
    status: "Active",
    parentName: "Sarah Beaumont",
    monthlyTuition: 450
  },
  {
    id: "2",
    name: "Sophie Chen",
    division: "Pre-Professional",
    status: "Active",
    parentName: "Michael Chen",
    monthlyTuition: 320
  },
  {
    id: "3",
    name: "Isabella Rodriguez",
    division: "Supplemental",
    status: "Pending",
    parentName: "Maria Rodriguez",
    monthlyTuition: 180
  }
];

const mockActivities: RecentActivity[] = [
  {
    id: "1",
    type: "enrollment",
    description: "New student Emma Beaumont enrolled in Professional Division",
    timestamp: "2 hours ago",
    status: "success"
  },
  {
    id: "2",
    type: "payment",
    description: "Payment received from Sarah Beaumont - $450",
    timestamp: "1 day ago",
    status: "success"
  },
  {
    id: "3",
    type: "contract",
    description: "Contract pending signature from Maria Rodriguez",
    timestamp: "2 days ago",
    status: "pending"
  }
];

const Dashboard = () => {
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

  const getActivityStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "status-active";
      case "pending":
        return "status-pending";
      case "warning":
        return "bg-warning text-warning-foreground";
      default:
        return "bg-muted";
    }
  };

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
              <div className="text-2xl font-bold text-primary">{mockStats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elegant transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Contracts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{mockStats.activeContracts}</div>
              <p className="text-xs text-muted-foreground">
                {mockStats.activeContracts}/{mockStats.totalStudents} signed
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elegant transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              <DollarSign className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{mockStats.pendingPayments}</div>
              <p className="text-xs text-muted-foreground">
                Requires follow-up
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
                ${mockStats.revenue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                +8% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Student Management */}
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Student Management</CardTitle>
                  <CardDescription>Recent enrollments and student status</CardDescription>
                </div>
                <Button variant="elegant" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search students..." className="pl-10" />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockStudents.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-smooth">
                  <div className="space-y-1">
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-muted-foreground">Parent: {student.parentName}</p>
                    <div className="flex gap-2">
                      <Badge className={getDivisionColor(student.division)}>
                        {student.division}
                      </Badge>
                      <Badge variant="outline" className={getStatusColor(student.status)}>
                        {student.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${student.monthlyTuition}/mo</p>
                    <Button variant="outline" size="sm" className="mt-1">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates and notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-smooth">
                  <div className="flex-shrink-0 mt-1">
                    {activity.type === "enrollment" && <UserCheck className="h-4 w-4 text-success" />}
                    {activity.type === "payment" && <DollarSign className="h-4 w-4 text-success" />}
                    {activity.type === "contract" && <FileText className="h-4 w-4 text-warning" />}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">{activity.description}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getActivityStatusColor(activity.status)}>
                        {activity.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
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
              <Button variant="professional" className="h-16 flex-col gap-2">
                <Plus className="h-5 w-5" />
                <span className="text-xs">New Student</span>
              </Button>
              <Button variant="professional" className="h-16 flex-col gap-2">
                <FileText className="h-5 w-5" />
                <span className="text-xs">Generate Contract</span>
              </Button>
              <Button variant="professional" className="h-16 flex-col gap-2">
                <DollarSign className="h-5 w-5" />
                <span className="text-xs">Payment Reminder</span>
              </Button>
              <Button variant="professional" className="h-16 flex-col gap-2">
                <Calendar className="h-5 w-5" />
                <span className="text-xs">Schedule Report</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;