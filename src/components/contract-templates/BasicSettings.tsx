import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle } from 'lucide-react';

interface BasicSettingsProps {
  formData: {
    name: string;
    season: string;
    division: string;
  };
  onChange: (updates: Partial<BasicSettingsProps['formData']>) => void;
}

export const BasicSettings = ({ formData, onChange }: BasicSettingsProps) => {
  return (
    <div className="bg-card border rounded-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-lg font-semibold">Template Settings</h2>
        <CheckCircle className="h-4 w-4 text-green-500" />
        <span className="text-sm text-muted-foreground">Step 1: Update basic information</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="name">Template Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => onChange({ name: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="season">Season</Label>
          <Input
            id="season"
            value={formData.season}
            onChange={(e) => onChange({ season: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="division">Division</Label>
          <Select
            value={formData.division}
            onValueChange={(value) => onChange({ division: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Divisions</SelectItem>
              <SelectItem value="Professional">Professional</SelectItem>
              <SelectItem value="Pre-Professional">Pre-Professional</SelectItem>
              <SelectItem value="Supplemental">Supplemental</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};