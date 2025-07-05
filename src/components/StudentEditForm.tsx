import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tables } from '@/integrations/supabase/types';
import { Save, X } from 'lucide-react';

type Student = Tables<'students'> & {
  parent: Tables<'parents'> | null;
};

interface StudentEditFormProps {
  student: Student;
  onSave: (studentData: Partial<Tables<'students'>>, parentData?: Partial<Tables<'parents'>>) => Promise<boolean>;
  onCancel: () => void;
}

export const StudentEditForm = ({ student, onSave, onCancel }: StudentEditFormProps) => {
  const [studentData, setStudentData] = useState({
    first_name: student.first_name,
    last_name: student.last_name,
    date_of_birth: student.date_of_birth || '',
    division: student.division,
    status: student.status || 'Pending',
    grade_level: student.grade_level || '',
    school_name: student.school_name || '',
    dance_experience: student.dance_experience || '',
    goals: student.goals || '',
    medical_notes: student.medical_notes || '',
    dietary_restrictions: student.dietary_restrictions || '',
  });

  const [parentData, setParentData] = useState({
    first_name: student.parent?.first_name || '',
    last_name: student.parent?.last_name || '',
    email: student.parent?.email || '',
    phone: student.parent?.phone || '',
    address: student.parent?.address || '',
    city: student.parent?.city || '',
    state: student.parent?.state || '',
    zip_code: student.parent?.zip_code || '',
    emergency_contact_name: student.parent?.emergency_contact_name || '',
    emergency_contact_phone: student.parent?.emergency_contact_phone || '',
    emergency_contact_relationship: student.parent?.emergency_contact_relationship || '',
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const success = await onSave(studentData, parentData);
    setSaving(false);
    if (success) {
      onCancel(); // Close edit mode
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Edit Student Profile</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel} disabled={saving}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Information */}
        <Card>
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="student_first_name">First Name</Label>
                <Input
                  id="student_first_name"
                  value={studentData.first_name}
                  onChange={(e) => setStudentData(prev => ({ ...prev, first_name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="student_last_name">Last Name</Label>
                <Input
                  id="student_last_name"
                  value={studentData.last_name}
                  onChange={(e) => setStudentData(prev => ({ ...prev, last_name: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="date_of_birth">Date of Birth</Label>
              <Input
                id="date_of_birth"
                type="date"
                value={studentData.date_of_birth}
                onChange={(e) => setStudentData(prev => ({ ...prev, date_of_birth: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="division">Division</Label>
                <Select value={studentData.division} onValueChange={(value) => setStudentData(prev => ({ ...prev, division: value as any }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Professional">Professional</SelectItem>
                    <SelectItem value="Pre-Professional">Pre-Professional</SelectItem>
                    <SelectItem value="Supplemental">Supplemental</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={studentData.status} onValueChange={(value) => setStudentData(prev => ({ ...prev, status: value as any }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Withdrawn">Withdrawn</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="grade_level">Grade Level</Label>
                <Input
                  id="grade_level"
                  value={studentData.grade_level}
                  onChange={(e) => setStudentData(prev => ({ ...prev, grade_level: e.target.value }))}
                  placeholder="e.g., 9th Grade"
                />
              </div>
              <div>
                <Label htmlFor="school_name">School Name</Label>
                <Input
                  id="school_name"
                  value={studentData.school_name}
                  onChange={(e) => setStudentData(prev => ({ ...prev, school_name: e.target.value }))}
                  placeholder="Student's school"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="dance_experience">Dance Experience</Label>
              <Textarea
                id="dance_experience"
                value={studentData.dance_experience}
                onChange={(e) => setStudentData(prev => ({ ...prev, dance_experience: e.target.value }))}
                placeholder="Previous dance experience..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="goals">Goals</Label>
              <Textarea
                id="goals"
                value={studentData.goals}
                onChange={(e) => setStudentData(prev => ({ ...prev, goals: e.target.value }))}
                placeholder="Student's dance goals..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="medical_notes">Medical Notes</Label>
              <Textarea
                id="medical_notes"
                value={studentData.medical_notes}
                onChange={(e) => setStudentData(prev => ({ ...prev, medical_notes: e.target.value }))}
                placeholder="Any medical conditions or notes..."
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="dietary_restrictions">Dietary Restrictions</Label>
              <Textarea
                id="dietary_restrictions"
                value={studentData.dietary_restrictions}
                onChange={(e) => setStudentData(prev => ({ ...prev, dietary_restrictions: e.target.value }))}
                placeholder="Any dietary restrictions..."
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Parent Information */}
        <Card>
          <CardHeader>
            <CardTitle>Parent/Guardian Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="parent_first_name">First Name</Label>
                <Input
                  id="parent_first_name"
                  value={parentData.first_name}
                  onChange={(e) => setParentData(prev => ({ ...prev, first_name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="parent_last_name">Last Name</Label>
                <Input
                  id="parent_last_name"
                  value={parentData.last_name}
                  onChange={(e) => setParentData(prev => ({ ...prev, last_name: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="parent_email">Email</Label>
                <Input
                  id="parent_email"
                  type="email"
                  value={parentData.email}
                  onChange={(e) => setParentData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="parent_phone">Phone</Label>
                <Input
                  id="parent_phone"
                  value={parentData.phone}
                  onChange={(e) => setParentData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={parentData.address}
                onChange={(e) => setParentData(prev => ({ ...prev, address: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={parentData.city}
                  onChange={(e) => setParentData(prev => ({ ...prev, city: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={parentData.state}
                  onChange={(e) => setParentData(prev => ({ ...prev, state: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="zip_code">ZIP Code</Label>
                <Input
                  id="zip_code"
                  value={parentData.zip_code}
                  onChange={(e) => setParentData(prev => ({ ...prev, zip_code: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
              <Input
                id="emergency_contact_name"
                value={parentData.emergency_contact_name}
                onChange={(e) => setParentData(prev => ({ ...prev, emergency_contact_name: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emergency_contact_phone">Emergency Contact Phone</Label>
                <Input
                  id="emergency_contact_phone"
                  value={parentData.emergency_contact_phone}
                  onChange={(e) => setParentData(prev => ({ ...prev, emergency_contact_phone: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="emergency_contact_relationship">Relationship</Label>
                <Input
                  id="emergency_contact_relationship"
                  value={parentData.emergency_contact_relationship}
                  onChange={(e) => setParentData(prev => ({ ...prev, emergency_contact_relationship: e.target.value }))}
                  placeholder="e.g., Grandparent, Uncle, Friend"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};