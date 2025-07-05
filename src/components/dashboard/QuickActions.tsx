import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  FileText, 
  DollarSign, 
  Calendar, 
  MessageSquare,
  BarChart3,
  Users,
  Send,
  FileCheck,
  Settings,
  Download,
  Upload
} from "lucide-react";

export const QuickActions = () => {
  const navigate = useNavigate();

  const studentActions = [
    {
      title: "New Student",
      description: "Add new enrollment",
      icon: Plus,
      action: () => navigate('/enroll'),
      variant: "professional" as const
    },
    {
      title: "Student List",
      description: "View all students",
      icon: Users,
      action: () => navigate('/students'),
      variant: "outline" as const
    }
  ];

  const contractActions = [
    {
      title: "Contract Management",
      description: "View and manage contracts",
      icon: FileText,
      action: () => navigate('/contracts'),
      variant: "professional" as const
    },
    {
      title: "Generate Contract",
      description: "Create new contract",
      icon: FileCheck,
      action: () => navigate('/contracts/new'),
      variant: "outline" as const
    }
  ];

  const financialActions = [
    {
      title: "Payment Reminder",
      description: "Send payment notices",
      icon: DollarSign,
      action: () => {},
      variant: "professional" as const
    },
    {
      title: "Financial Report",
      description: "Generate revenue report",
      icon: BarChart3,
      action: () => {},
      variant: "outline" as const
    }
  ];

  const communicationActions = [
    {
      title: "Send Announcement",
      description: "Broadcast to all parents",
      icon: Send,
      action: () => {},
      variant: "professional" as const
    },
    {
      title: "Schedule Message",
      description: "Plan future communications",
      icon: MessageSquare,
      action: () => {},
      variant: "outline" as const
    }
  ];

  const administrativeActions = [
    {
      title: "Schedule Report",
      description: "View class schedules",
      icon: Calendar,
      action: () => {},
      variant: "professional" as const
    },
    {
      title: "Export Data",
      description: "Download student data",
      icon: Download,
      action: () => {},
      variant: "outline" as const
    },
    {
      title: "Import Data",
      description: "Upload student information",
      icon: Upload,
      action: () => {},
      variant: "outline" as const
    },
    {
      title: "Studio Settings",
      description: "Configure conservatory",
      icon: Settings,
      action: () => {},
      variant: "outline" as const
    }
  ];

  const ActionSection = ({ title, actions, columns = 2 }: { 
    title: string; 
    actions: typeof studentActions; 
    columns?: number;
  }) => (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className={`grid grid-cols-1 ${columns === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-3`}>
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant}
            className="h-16 flex-col gap-2 text-center"
            onClick={action.action}
          >
            <action.icon className="h-5 w-5" />
            <div>
              <div className="text-xs font-medium">{action.title}</div>
              <div className="text-xs opacity-70">{action.description}</div>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActionSection title="Student Management" actions={studentActions} />
        <ActionSection title="Contract Management" actions={contractActions} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActionSection title="Financial Operations" actions={financialActions} />
        <ActionSection title="Communications" actions={communicationActions} />
      </div>

      <ActionSection title="Administrative Tools" actions={administrativeActions} columns={4} />
    </div>
  );
};