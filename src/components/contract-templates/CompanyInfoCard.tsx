import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CompanyInfoCardProps {
  companyName: string;
  directorEmail: string;
  studioContact: string;
  onChange: (field: string, value: string) => void;
}

export const CompanyInfoCard = ({ 
  companyName, 
  directorEmail, 
  studioContact, 
  onChange 
}: CompanyInfoCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Company & Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              value={companyName}
              onChange={(e) => onChange('companyName', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="directorEmail">Director Email</Label>
            <Input
              id="directorEmail"
              value={directorEmail}
              onChange={(e) => onChange('directorEmail', e.target.value)}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="studioContact">Studio Contact Information</Label>
          <Input
            id="studioContact"
            value={studioContact}
            onChange={(e) => onChange('studioContact', e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};