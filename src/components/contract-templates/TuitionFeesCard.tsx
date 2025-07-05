import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TuitionFeesCardProps {
  professionalFee: string;
  preProFee: string;
  supplementalFee: string;
  paymentDueDate: string;
  invoiceSendDate: string;
  lateFee: string;
  lateGracePeriod: string;
  onChange: (field: string, value: string) => void;
}

export const TuitionFeesCard = ({ 
  professionalFee,
  preProFee,
  supplementalFee,
  paymentDueDate,
  invoiceSendDate,
  lateFee,
  lateGracePeriod,
  onChange 
}: TuitionFeesCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tuition & Fees</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="professionalFee">Professional Division ($)</Label>
            <Input
              id="professionalFee"
              type="number"
              value={professionalFee}
              onChange={(e) => onChange('professionalFee', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="preProFee">Pre-Professional Division ($)</Label>
            <Input
              id="preProFee"
              type="number"
              value={preProFee}
              onChange={(e) => onChange('preProFee', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="supplementalFee">Supplemental Division ($)</Label>
            <Input
              id="supplementalFee"
              type="number"
              value={supplementalFee}
              onChange={(e) => onChange('supplementalFee', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="paymentDueDate">Payment Due Date</Label>
            <Select
              value={paymentDueDate}
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
              value={invoiceSendDate}
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
              value={lateFee}
              onChange={(e) => onChange('lateFee', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="lateGracePeriod">Late Fee Grace Period (Days)</Label>
            <Select
              value={lateGracePeriod}
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
      </CardContent>
    </Card>
  );
};