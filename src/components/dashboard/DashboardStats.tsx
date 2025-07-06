import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  FileText, 
  DollarSign, 
  TrendingUp
} from "lucide-react";
import { formatCurrency } from "@/lib/dashboard-utils";

interface DashboardStatsProps {
  stats: {
    totalStudents: number;
    activeContracts: number;
    pendingPayments: number;
    monthlyRevenue: number;
  };
}

const DashboardStats = ({ stats }: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
  );
};

export default DashboardStats;