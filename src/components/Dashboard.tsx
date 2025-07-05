import { useDashboardStats } from "@/hooks/useDashboardStats";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";
import { DashboardLoadingState } from "@/components/dashboard/DashboardLoadingState";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { NotificationCenter } from "@/components/dashboard/NotificationCenter";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";

const Dashboard = () => {
  const stats = useDashboardStats();

  // Loading state
  if (stats.loading) {
    return <DashboardLoadingState />;
  }

  // Show empty state for new studio
  if (stats.totalStudents === 0 && !stats.loading) {
    return <DashboardEmptyState />;
  }

  return (
    <DashboardLayout>
      <DashboardHeader />
      <DashboardStats />
      <NotificationCenter />
      <ActivityFeed />
      <QuickActions />
    </DashboardLayout>
  );
};

export default Dashboard;