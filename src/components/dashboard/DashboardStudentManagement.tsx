import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Plus,
  Search,
  Filter
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getDivisionColor, getStatusColor } from "@/lib/dashboard-helpers";

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  division: string;
  status: string | null;
  parent: {
    first_name: string;
    last_name: string;
  } | null;
}

interface DashboardStudentManagementProps {
  students: Student[];
  studentsLoading: boolean;
  setIsSearchOpen: (open: boolean) => void;
}

const DashboardStudentManagement = ({ 
  students, 
  studentsLoading, 
  setIsSearchOpen 
}: DashboardStudentManagementProps) => {
  const navigate = useNavigate();

  return (
    <Card className="shadow-card lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Student Management</CardTitle>
            <CardDescription>Recent enrollments and student status</CardDescription>
          </div>
          <Button variant="elegant" size="sm" onClick={() => navigate('/enroll')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search everything..." 
              className="pl-10 cursor-pointer" 
              onClick={() => setIsSearchOpen(true)}
              readOnly
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {studentsLoading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="p-3 rounded-lg border">
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-3 w-24 mb-2" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
          ))
        ) : students.length > 0 ? (
          students.slice(0, 3).map((student) => (
            <div key={student.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-smooth">
              <div className="space-y-1">
                <p className="font-medium">{student.first_name} {student.last_name}</p>
                <p className="text-sm text-muted-foreground">
                  Parent: {student.parent?.first_name} {student.parent?.last_name}
                </p>
                <div className="flex gap-2">
                  <Badge className={getDivisionColor(student.division)}>
                    {student.division}
                  </Badge>
                  <Badge variant="outline" className={getStatusColor(student.status || 'Pending')}>
                    {student.status}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/students/${student.id}`)}
                >
                  Edit Profile
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No students enrolled yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardStudentManagement;