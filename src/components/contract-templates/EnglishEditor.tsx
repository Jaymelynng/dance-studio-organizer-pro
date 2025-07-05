import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface EnglishFormData {
  companyName: string;
  season: string;
  seasonStartDate: string;
  seasonEndDate: string;
  terminationNotice: string;
  dismissalPeriod: string;
  professionalFee: string;
  preProFee: string;
  supplementalFee: string;
  paymentDueDate: string;
  invoiceSendDate: string;
  lateFee: string;
  lateGracePeriod: string;
  attendancePolicy: string;
  injuryPolicy: string;
  conductPolicy: string;
  directorEmail: string;
  studioContact: string;
}

interface EnglishEditorProps {
  formData: EnglishFormData;
  onChange: (field: keyof EnglishFormData, value: string) => void;
}

export const EnglishEditor = ({ formData, onChange }: EnglishEditorProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            value={formData.companyName}
            onChange={(e) => onChange('companyName', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="directorEmail">Director Email</Label>
          <Input
            id="directorEmail"
            value={formData.directorEmail}
            onChange={(e) => onChange('directorEmail', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="seasonStartDate">Season Start Date (Optional)</Label>
          <Input
            id="seasonStartDate"
            type="date"
            value={formData.seasonStartDate}
            onChange={(e) => onChange('seasonStartDate', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="seasonEndDate">Season End Date (Optional)</Label>
          <Input
            id="seasonEndDate"
            type="date"
            value={formData.seasonEndDate}
            onChange={(e) => onChange('seasonEndDate', e.target.value)}
          />
        </div>
      </div>

      <div>
        <h4 className="text-lg font-semibold mb-3">Enrollment Terms</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="terminationNotice">Early Termination Notice (Days)</Label>
            <Select
              value={formData.terminationNotice}
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
              value={formData.dismissalPeriod}
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
      </div>

      <div>
        <h4 className="text-lg font-semibold mb-3">Tuition & Fees</h4>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <Label htmlFor="professionalFee">Professional Division ($)</Label>
            <Input
              id="professionalFee"
              type="number"
              value={formData.professionalFee}
              onChange={(e) => onChange('professionalFee', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="preProFee">Pre-Professional Division ($)</Label>
            <Input
              id="preProFee"
              type="number"
              value={formData.preProFee}
              onChange={(e) => onChange('preProFee', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="supplementalFee">Supplemental Division ($)</Label>
            <Input
              id="supplementalFee"
              type="number"
              value={formData.supplementalFee}
              onChange={(e) => onChange('supplementalFee', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="paymentDueDate">Payment Due Date</Label>
            <Select
              value={formData.paymentDueDate}
              onValueChange={(value) => onChange('paymentDueDate', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1st">1st of month</SelectItem>
                <SelectItem value="5th">5th of month</SelectItem>
                <SelectItem value="15th">15th of month</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="invoiceSendDate">Invoice Send Date</Label>
            <Select
              value={formData.invoiceSendDate}
              onValueChange={(value) => onChange('invoiceSendDate', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="20th">20th of month</SelectItem>
                <SelectItem value="25th">25th of month</SelectItem>
                <SelectItem value="30th">30th of month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="lateFee">Late Fee Amount ($)</Label>
            <Input
              id="lateFee"
              type="number"
              value={formData.lateFee}
              onChange={(e) => onChange('lateFee', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="lateGracePeriod">Late Fee Grace Period (Days)</Label>
            <Select
              value={formData.lateGracePeriod}
              onValueChange={(value) => onChange('lateGracePeriod', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 day</SelectItem>
                <SelectItem value="3">3 days</SelectItem>
                <SelectItem value="5">5 days</SelectItem>
                <SelectItem value="7">7 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-semibold mb-3">Studio Policies</h4>
        <div className="space-y-4">
          <div>
            <Label htmlFor="attendancePolicy">Attendance Policy</Label>
            <Textarea
              id="attendancePolicy"
              value={formData.attendancePolicy}
              onChange={(e) => onChange('attendancePolicy', e.target.value)}
              className="min-h-[80px]"
            />
          </div>
          <div>
            <Label htmlFor="injuryPolicy">Injury Policy</Label>
            <Textarea
              id="injuryPolicy"
              value={formData.injuryPolicy}
              onChange={(e) => onChange('injuryPolicy', e.target.value)}
              className="min-h-[80px]"
            />
          </div>
          <div>
            <Label htmlFor="conductPolicy">Student Conduct Policy</Label>
            <Textarea
              id="conductPolicy"
              value={formData.conductPolicy}
              onChange={(e) => onChange('conductPolicy', e.target.value)}
              className="min-h-[80px]"
            />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="studioContact">Studio Contact Information</Label>
        <Input
          id="studioContact"
          value={formData.studioContact}
          onChange={(e) => onChange('studioContact', e.target.value)}
        />
      </div>
    </div>
  );
};