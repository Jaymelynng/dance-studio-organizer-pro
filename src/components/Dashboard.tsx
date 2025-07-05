import { GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { EmptyState } from "@/components/EmptyState";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { NotificationCenter } from "@/components/dashboard/NotificationCenter";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";

const Dashboard = () => {
  const navigate = useNavigate();
  const stats = useDashboardStats();

  // Loading state
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
          <DashboardStats />
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
            Management Hub
          </p>
        </div>

        {/* Enhanced Stats Overview */}
        <DashboardStats />

        {/* Notifications & Alerts */}
        <NotificationCenter />

        {/* Activity Feed */}
        <ActivityFeed />

        {/* Comprehensive Quick Actions */}
        <QuickActions />
      </div>
    </div>
  );
};

export default Dashboard;