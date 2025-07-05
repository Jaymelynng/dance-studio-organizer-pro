import { DashboardLayout } from "./DashboardLayout";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardStats } from "./DashboardStats";

export const DashboardLoadingState = () => {
  return (
    <DashboardLayout>
      <DashboardHeader loading />
      <DashboardStats />
    </DashboardLayout>
  );
};