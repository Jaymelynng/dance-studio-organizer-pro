import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Users, GraduationCap, UserCheck, UserX, Download, Search, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const StudentReportsTab = () => {
  const [division, setDivision] = useState<string>('all');
  const [status, setStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch student data
  const { data: studentsData, isLoading } = useQuery({
    queryKey: ['student-reports', division, status],
    queryFn: async () => {
      let query = supabase
        .from('students')
        .select(`
          *,
          parent:parents(*),
          contracts(
            id,
            status,
            monthly_tuition,
            registration_fee,
            created_at,
            contract_start_date,
            contract_end_date
          )
        `);

      if (division !== 'all') {
        query = query.eq('division', division as any);
      }

      if (status !== 'all') {
        query = query.eq('status', status as any);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const filteredStudents = studentsData?.filter(student => 
    searchTerm === '' || 
    `${student.first_name} ${student.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.parent?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const calculateMetrics = () => {
    if (!studentsData) return {
      total: 0,
      active: 0,
      pending: 0,
      inactive: 0,
      byDivision: { Professional: 0, 'Pre-Professional': 0, Supplemental: 0 },
      averageAge: 0,
      retention: 0
    };

    const total = studentsData.length;
    const active = studentsData.filter(s => s.status === 'Active').length;
    const pending = studentsData.filter(s => s.status === 'Pending').length;
    const inactive = studentsData.filter(s => s.status === 'Inactive' || s.status === 'Withdrawn').length;

    const byDivision = {
      Professional: studentsData.filter(s => s.division === 'Professional').length,
      'Pre-Professional': studentsData.filter(s => s.division === 'Pre-Professional').length,
      Supplemental: studentsData.filter(s => s.division === 'Supplemental').length,
    };

    const studentsWithAge = studentsData.filter(s => s.date_of_birth);
    const averageAge = studentsWithAge.length > 0 
      ? studentsWithAge.reduce((sum, s) => {
          const age = new Date().getFullYear() - new Date(s.date_of_birth!).getFullYear();
          return sum + age;
        }, 0) / studentsWithAge.length
      : 0;

    const retention = total > 0 ? (active / total) * 100 : 0;

    return {
      total,
      active,
      pending,
      inactive,
      byDivision,
      averageAge,
      retention
    };
  };

  const metrics = calculateMetrics();

  const exportReport = () => {
    const csvContent = [
      ['Student Report'],
      ['Generated:', new Date().toLocaleDateString()],
      [],
      ['Summary'],
      ['Total Students', metrics.total.toString()],
      ['Active Students', metrics.active.toString()],
      ['Pending Students', metrics.pending.toString()],
      ['Inactive Students', metrics.inactive.toString()],
      ['Average Age', metrics.averageAge.toFixed(1)],
      ['Retention Rate', `${metrics.retention.toFixed(1)}%`],
      [],
      ['By Division'],
      ['Professional', metrics.byDivision.Professional.toString()],
      ['Pre-Professional', metrics.byDivision['Pre-Professional'].toString()],
      ['Supplemental', metrics.byDivision.Supplemental.toString()],
      [],
      ['Student Details'],
      ['Name', 'Division', 'Status', 'Age', 'Parent Email', 'Enrollment Date', 'Active Contract']
    ];

    filteredStudents.forEach(student => {
      const age = student.date_of_birth 
        ? new Date().getFullYear() - new Date(student.date_of_birth).getFullYear()
        : '';
      const hasActiveContract = student.contracts?.some(c => c.status === 'Active') ? 'Yes' : 'No';
      
      csvContent.push([
        `${student.first_name} ${student.last_name}`,
        student.division,
        student.status || 'Pending',
        age.toString(),
        student.parent?.email || '',
        student.created_at ? new Date(student.created_at).toLocaleDateString() : '',
        hasActiveContract
      ]);
    });

    const csv = csvContent.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `student-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getDivisionColor = (division: string) => {
    switch (division) {
      case "Professional": return "division-professional";
      case "Pre-Professional": return "division-pre-professional";
      case "Supplemental": return "division-supplemental";
      default: return "bg-muted";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "status-active";
      case "Pending": return "status-pending";
      case "Inactive": 
      case "Withdrawn": return "status-inactive";
      default: return "bg-muted";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Student Reports</h2>
          <p className="text-white/70">Enrollment analytics and student demographics</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={division} onValueChange={setDivision}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Divisions</SelectItem>
              <SelectItem value="Professional">Professional</SelectItem>
              <SelectItem value="Pre-Professional">Pre-Professional</SelectItem>
              <SelectItem value="Supplemental">Supplemental</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Student Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{metrics.total}</div>
            <p className="text-xs text-muted-foreground">
              All enrollments
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <UserCheck className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{metrics.active}</div>
            <p className="text-xs text-muted-foreground">
              Currently enrolled
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Age</CardTitle>
            <GraduationCap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{metrics.averageAge.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              Years old
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{metrics.retention.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Active vs total
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Division Breakdown */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>By Division</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(metrics.byDivision).map(([div, count]) => (
                <div key={div} className="flex justify-between items-center">
                  <Badge className={getDivisionColor(div)}>
                    {div}
                  </Badge>
                  <span className="font-medium">{count} students</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Status Breakdown */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>By Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Badge className="status-active">Active</Badge>
                <span className="font-medium">{metrics.active} students</span>
              </div>
              <div className="flex justify-between items-center">
                <Badge className="status-pending">Pending</Badge>
                <span className="font-medium">{metrics.pending} students</span>
              </div>
              <div className="flex justify-between items-center">
                <Badge className="status-inactive">Inactive</Badge>
                <span className="font-medium">{metrics.inactive} students</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Enrollments */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Recent Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse flex justify-between items-center">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                ))
              ) : studentsData?.slice(0, 5).map((student) => (
                <div key={student.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-sm">
                      {student.first_name} {student.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {student.created_at ? new Date(student.created_at).toLocaleDateString() : 'No date'}
                    </p>
                  </div>
                  <Badge className={getDivisionColor(student.division)} variant="outline">
                    {student.division}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student List */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Student Directory ({filteredStudents.length} students)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              [...Array(10)].map((_, i) => (
                <div key={i} className="animate-pulse flex justify-between items-center p-4 border rounded">
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-48"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-5 bg-gray-200 rounded w-20"></div>
                    <div className="h-5 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              ))
            ) : filteredStudents.length > 0 ? (
              filteredStudents.map((student) => {
                const age = student.date_of_birth 
                  ? new Date().getFullYear() - new Date(student.date_of_birth).getFullYear()
                  : null;
                const hasActiveContract = student.contracts?.some(c => c.status === 'Active');
                
                return (
                  <div key={student.id} className="flex justify-between items-center p-4 border rounded hover:bg-muted/50">
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium">
                            {student.first_name} {student.last_name}
                            {age && <span className="text-muted-foreground ml-2">({age} years)</span>}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Parent: {student.parent?.first_name} {student.parent?.last_name} • {student.parent?.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Badge className={getDivisionColor(student.division)}>
                        {student.division}
                      </Badge>
                      <Badge className={getStatusColor(student.status || 'Pending')}>
                        {student.status}
                      </Badge>
                      {hasActiveContract && (
                        <Badge variant="outline" className="text-success border-success">
                          Contract
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No students found matching your criteria
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};