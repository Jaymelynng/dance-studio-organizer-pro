import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SeasonInfoCardProps {
  seasonStartDate: string;
  seasonEndDate: string;
  onChange: (field: string, value: string) => void;
}

export const SeasonInfoCard = ({ 
  seasonStartDate, 
  seasonEndDate, 
  onChange 
}: SeasonInfoCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Season Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="seasonStartDate">Season Start Date (Optional)</Label>
            <Input
              id="seasonStartDate"
              type="date"
              value={seasonStartDate}
              onChange={(e) => onChange('seasonStartDate', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="seasonEndDate">Season End Date (Optional)</Label>
            <Input
              id="seasonEndDate"
              type="date"
              value={seasonEndDate}
              onChange={(e) => onChange('seasonEndDate', e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};