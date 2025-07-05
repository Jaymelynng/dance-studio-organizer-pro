import { GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { EmptyState } from "@/components/EmptyState";
import { DashboardLayout } from "./DashboardLayout";
import { DashboardHeader } from "./DashboardHeader";

export const DashboardEmptyState = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <DashboardHeader isEmpty />
      
      <div className="max-w-2xl mx-auto">
        <EmptyState
          title="Welcome to Your Studio"
          description="Ready to begin your journey? Start by adding your first student to bring your conservatory to life."
          actionLabel="Add First Student"
          onAction={() => navigate('/enroll')}
          icon={<GraduationCap className="h-12 w-12 text-primary" />}
        />
      </div>
    </DashboardLayout>
  );
};