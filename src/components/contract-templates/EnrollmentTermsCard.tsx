import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EnrollmentTermsCardProps {
  terminationNotice: string;
  dismissalPeriod: string;
  onChange: (field: string, value: string) => void;
}

export const EnrollmentTermsCard = ({ 
  terminationNotice, 
  dismissalPeriod, 
  onChange 
}: EnrollmentTermsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Enrollment Terms</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="terminationNotice">Early Termination Notice (Days)</Label>
            <Select
              value={terminationNotice}
              onValueChange={(value) => onChange('terminationNotice', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="60">60 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="dismissalPeriod">Dismissal Financial Responsibility (Days)</Label>
            <Select
              value={dismissalPeriod}
              onValueChange={(value) => onChange('dismissalPeriod', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="60">60 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};