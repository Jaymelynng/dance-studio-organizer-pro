import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRecordPayment, useStudentsForPayment } from '@/hooks/usePaymentCenter';
import { usePaymentCategories } from '@/hooks/usePaymentCategories';

const RecordPaymentDialog = () => {
  const { toast } = useToast();
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const { data: students } = useStudentsForPayment();
  const { data: categories } = usePaymentCategories();
  const recordPaymentMutation = useRecordPayment();

  const handleRecordPayment = () => {
    if (!selectedStudent || !selectedCategory || !paymentAmount || !paymentMethod) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    recordPaymentMutation.mutate(
      {
        studentId: selectedStudent,
        categoryId: selectedCategory,
        amount: paymentAmount,
        method: paymentMethod,
        notes: paymentNotes
      },
      {
        onSuccess: () => {
          setIsOpen(false);
          setSelectedStudent('');
          setSelectedCategory('');
          setPaymentAmount('');
          setPaymentMethod('');
          setPaymentNotes('');
        }
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="elegant">
          <Plus className="h-4 w-4 mr-2" />
          Record Payment
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Record New Payment</DialogTitle>
          <DialogDescription>
            Record a payment received from a student
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Student *</label>
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger>
                <SelectValue placeholder="Select a student" />
              </SelectTrigger>
              <SelectContent>
                {students?.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.first_name} {student.last_name} ({student.division})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Payment Category *</label>
            <Select value={selectedCategory} onValueChange={(value) => {
              setSelectedCategory(value);
              // Auto-fill amount if category has default
              const category = categories?.find(c => c.id === value);
              if (category?.default_amount) {
                setPaymentAmount(category.default_amount.toString());
              }
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name} {category.default_amount ? `($${category.default_amount})` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Amount *</label>
            <Input
              type="number"
              step="0.01"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Payment Method *</label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Square">Square</SelectItem>
                <SelectItem value="Venmo">Venmo</SelectItem>
                <SelectItem value="Check">Check</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Notes</label>
            <Textarea
              value={paymentNotes}
              onChange={(e) => setPaymentNotes(e.target.value)}
              placeholder="Payment notes..."
              rows={3}
            />
          </div>
          <Button 
            onClick={handleRecordPayment} 
            disabled={recordPaymentMutation.isPending}
            className="w-full min-h-[48px]"
          >
            {recordPaymentMutation.isPending ? "Recording..." : "Record Payment"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecordPaymentDialog;