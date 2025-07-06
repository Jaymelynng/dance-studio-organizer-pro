import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus,
  FileText, 
  DollarSign, 
  Calendar
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const DashboardQuickActions = () => {
  const navigate = useNavigate();

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks and operations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <Button variant="professional" className="h-20 sm:h-16 flex-col gap-2 min-h-[80px] sm:min-h-[64px]" onClick={() => navigate('/enroll')}>
            <Plus className="h-5 w-5" />
            <span className="text-xs text-center">New Student</span>
          </Button>
          <Button variant="professional" className="h-20 sm:h-16 flex-col gap-2 min-h-[80px] sm:min-h-[64px]" onClick={() => navigate('/contracts')}>
            <FileText className="h-5 w-5" />
            <span className="text-xs text-center">Contracts</span>
          </Button>
          <Button variant="professional" className="h-20 sm:h-16 flex-col gap-2 min-h-[80px] sm:min-h-[64px]" onClick={() => navigate('/communications')}>
            <DollarSign className="h-5 w-5" />
            <span className="text-xs text-center">Payments</span>
          </Button>
          <Button variant="professional" className="h-20 sm:h-16 flex-col gap-2 min-h-[80px] sm:min-h-[64px]" onClick={() => navigate('/templates')}>
            <FileText className="h-5 w-5" />
            <span className="text-xs text-center">Templates</span>
          </Button>
          <Button variant="professional" className="h-20 sm:h-16 flex-col gap-2 min-h-[80px] sm:min-h-[64px] col-span-2 sm:col-span-1" onClick={() => navigate('/reports')}>
            <Calendar className="h-5 w-5" />
            <span className="text-xs text-center">Reports</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardQuickActions;