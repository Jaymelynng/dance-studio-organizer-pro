import { GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useStudents } from "@/hooks/useStudents";
import { useActivities } from "@/hooks/useActivities";
import { useOpenTasks } from "@/hooks/useOpenTasks";
import { EmptyState } from "@/components/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { GlobalSearch } from "@/components/GlobalSearch";
import { Card, CardContent } from "@/components/ui/card";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardQuickActions from "@/components/dashboard/DashboardQuickActions";
import DashboardStudentManagement from "@/components/dashboard/DashboardStudentManagement";
import DashboardRecentActivity from "@/components/dashboard/DashboardRecentActivity";
import DashboardOpenTasks from "@/components/dashboard/DashboardOpenTasks";

const Dashboard = () => {
  const navigate = useNavigate();
  const stats = useDashboardStats();
  const { students, loading: studentsLoading } = useStudents();
  const { activities, loading: activitiesLoading } = useActivities();
  const { tasks: openTasks, loading: tasksLoading } = useOpenTasks();
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
        <DashboardHeader />

        <DashboardStats stats={stats} />

        <DashboardQuickActions />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <DashboardStudentManagement 
            students={students}
            studentsLoading={studentsLoading}
            setIsSearchOpen={setIsSearchOpen}
          />

          <DashboardRecentActivity 
            activities={activities}
            activitiesLoading={activitiesLoading}
          />
        </div>

        <DashboardOpenTasks 
          openTasks={openTasks}
          tasksLoading={tasksLoading}
        />
        
        <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      </div>
    </div>
  );
};

export default Dashboard;