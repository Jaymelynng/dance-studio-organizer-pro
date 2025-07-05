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
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Button variant="professional" className="h-16 flex-col gap-2" onClick={() => navigate('/enroll')}>
            <Plus className="h-5 w-5" />
            <span className="text-xs">New Student</span>
          </Button>
          <Button variant="professional" className="h-16 flex-col gap-2" onClick={() => navigate('/contracts')}>
            <FileText className="h-5 w-5" />
            <span className="text-xs">Contracts</span>
          </Button>
          <Button variant="professional" className="h-16 flex-col gap-2" onClick={() => navigate('/communications')}>
            <DollarSign className="h-5 w-5" />
            <span className="text-xs">Payments</span>
          </Button>
          <Button variant="professional" className="h-16 flex-col gap-2" onClick={() => navigate('/templates')}>
            <FileText className="h-5 w-5" />
            <span className="text-xs">Templates</span>
          </Button>
          <Button variant="professional" className="h-16 flex-col gap-2" onClick={() => navigate('/reports')}>
            <Calendar className="h-5 w-5" />
            <span className="text-xs">Reports</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardQuickActions;