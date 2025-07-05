import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  Calendar,
  UserCheck,
  Clock
} from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { Skeleton } from "@/components/ui/skeleton";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const DashboardStats = () => {
  const stats = useDashboardStats();

  if (stats.loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="shadow-card">
            <CardContent className="p-6">
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const mainStats = [
    {
      title: "Total Students",
      value: stats.totalStudents,
      description: "Active enrollment",
      icon: Users,
      color: "text-primary"
    },
    {
      title: "Active Contracts",
      value: stats.activeContracts,
      description: `${stats.activeContracts}/${stats.totalStudents} signed`,
      icon: FileText,
      color: "text-primary"
    },
    {
      title: "Pending Payments",
      value: stats.pendingPayments,
      description: stats.pendingPayments > 0 ? 'Requires follow-up' : 'All current',
      icon: DollarSign,
      color: stats.pendingPayments > 0 ? "text-warning" : "text-success"
    },
    {
      title: "Monthly Revenue",
      value: formatCurrency(stats.monthlyRevenue),
      description: "From active contracts",
      icon: TrendingUp,
      color: "text-success"
    }
  ];

  const additionalStats = [
    {
      title: "Overdue Items",
      value: 5,
      description: "Need immediate attention",
      icon: AlertTriangle,
      color: "text-destructive"
    },
    {
      title: "This Week's Classes",
      value: 24,
      description: "Scheduled sessions",
      icon: Calendar,
      color: "text-primary"
    },
    {
      title: "New Enrollments",
      value: 3,
      description: "This month",
      icon: UserCheck,
      color: "text-success"
    },
    {
      title: "Pending Tasks",
      value: 8,
      description: "Administrative items",
      icon: Clock,
      color: "text-warning"
    }
  ];

  const allStats = [...mainStats, ...additionalStats];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {allStats.map((stat, index) => (
        <Card key={index} className="shadow-card hover:shadow-elegant transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};