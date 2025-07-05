import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, User, Phone, MapPin, Calendar, GraduationCap } from 'lucide-react';
import { useStudentProfile } from '@/hooks/useStudentProfile';
import { StudentEditForm } from '@/components/StudentEditForm';
import { Skeleton } from '@/components/ui/skeleton';

const StudentProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { student, loading, updateStudent } = useStudentProfile(id);
  const [isEditing, setIsEditing] = useState(false);

  const getDivisionColor = (division: string) => {
    switch (division) {
      case "Professional":
        return "division-professional";
      case "Pre-Professional":
        return "division-pre-professional";
      case "Supplemental":
        return "division-supplemental";
      default:
        return "bg-muted";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "status-active";
      case "Pending":
        return "status-pending";
      case "Inactive":
        return "status-inactive";
      default:
        return "bg-muted";
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <div className="container mx-auto p-6">
          <div className="mb-6">
            <Button variant="outline" onClick={() => navigate("/")} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <div className="space-y-4">
              <Skeleton className="h-8 w-64" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-32" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[...Array(6)].map((_, i) => (
                      <Skeleton key={i} className="h-4 w-full" />
                    ))}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-32" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[...Array(6)].map((_, i) => (
                      <Skeleton key={i} className="h-4 w-full" />
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <div className="container mx-auto p-6">
          <div className="mb-6">
            <Button variant="outline" onClick={() => navigate("/")} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <div className="text-center py-8">
              <h1 className="text-2xl font-bold mb-2">Student Not Found</h1>
              <p className="text-muted-foreground">The student you're looking for doesn't exist.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <div className="container mx-auto p-6">
          <div className="mb-6">
            <Button variant="outline" onClick={() => navigate("/")} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <StudentEditForm
              student={student}
              onSave={updateStudent}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate("/")} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {student.first_name} {student.last_name}
              </h1>
              <div className="flex gap-2">
                <Badge className={getDivisionColor(student.division)}>
                  {student.division}
                </Badge>
                <Badge variant="outline" className={getStatusColor(student.status || 'Pending')}>
                  {student.status}
                </Badge>
              </div>
            </div>
            <Button onClick={() => setIsEditing(true)} className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Student Information */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Student Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(student.date_of_birth)}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Grade Level</label>
                    <div className="flex items-center gap-2 mt-1">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <span>{student.grade_level || 'Not specified'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">School</label>
                  <p className="mt-1">{student.school_name || 'Not specified'}</p>
                </div>

                {student.dance_experience && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Dance Experience</label>
                    <p className="mt-1 text-sm">{student.dance_experience}</p>
                  </div>
                )}

                {student.goals && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Goals</label>
                    <p className="mt-1 text-sm">{student.goals}</p>
                  </div>
                )}

                {student.medical_notes && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Medical Notes</label>
                    <p className="mt-1 text-sm">{student.medical_notes}</p>
                  </div>
                )}

                {student.dietary_restrictions && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Dietary Restrictions</label>
                    <p className="mt-1 text-sm">{student.dietary_restrictions}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Parent Information */}
            {student.parent && (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Parent/Guardian Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Name</label>
                    <p className="mt-1 font-medium">{student.parent.first_name} {student.parent.last_name}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <p className="mt-1">{student.parent.email}</p>
                    </div>
                    {student.parent.phone && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Phone</label>
                        <div className="flex items-center gap-2 mt-1">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{student.parent.phone}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {(student.parent.address || student.parent.city || student.parent.state) && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Address</label>
                      <div className="flex items-start gap-2 mt-1">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          {student.parent.address && <p>{student.parent.address}</p>}
                          {(student.parent.city || student.parent.state || student.parent.zip_code) && (
                            <p>
                              {student.parent.city && student.parent.city}
                              {student.parent.city && student.parent.state && ', '}
                              {student.parent.state && student.parent.state}
                              {student.parent.zip_code && ` ${student.parent.zip_code}`}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {student.parent.emergency_contact_name && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Emergency Contact</label>
                      <div className="mt-1 space-y-1">
                        <p className="font-medium">{student.parent.emergency_contact_name}</p>
                        {student.parent.emergency_contact_phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{student.parent.emergency_contact_phone}</span>
                          </div>
                        )}
                        {student.parent.emergency_contact_relationship && (
                          <p className="text-sm text-muted-foreground">
                            Relationship: {student.parent.emergency_contact_relationship}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;