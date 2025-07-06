import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Edit2, DollarSign } from 'lucide-react';
import { useTuitionRates, useUpdateTuitionRate } from '@/hooks/useTuitionRates';

const TuitionRatesManager = () => {
  const { data: rates, isLoading } = useTuitionRates();
  const updateRate = useUpdateTuitionRate();
  
  const [editingRate, setEditingRate] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    monthly_tuition: '',
    registration_fee: ''
  });

  const handleEdit = (rate: any) => {
    setFormData({
      monthly_tuition: rate.monthly_tuition.toString(),
      registration_fee: rate.registration_fee.toString()
    });
    setEditingRate(rate.id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingRate) {
      await updateRate.mutateAsync({
        id: editingRate,
        monthly_tuition: parseFloat(formData.monthly_tuition),
        registration_fee: parseFloat(formData.registration_fee)
      });
      setEditingRate(null);
    }
    
    setFormData({ monthly_tuition: '', registration_fee: '' });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getDivisionColor = (division: string) => {
    switch (division) {
      case 'Professional': return 'bg-primary/10 text-primary border-primary/20';
      case 'Pre-Professional': return 'bg-secondary/10 text-secondary-foreground border-secondary/20';
      case 'Supplemental': return 'bg-accent/10 text-accent-foreground border-accent/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Tuition Rates</CardTitle>
        <CardDescription>Manage tuition and fee rates for each division</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 border rounded-lg">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-6 w-24 mb-2" />
                <Skeleton className="h-6 w-24" />
              </div>
            ))}
          </div>
        ) : rates && rates.length > 0 ? (
          <div className="space-y-4">
            {rates.map((rate) => (
              <div key={rate.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-smooth">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge className={getDivisionColor(rate.division)} variant="outline">
                      {rate.division}
                    </Badge>
                    <Badge variant="secondary">Current Season</Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-success" />
                      <div>
                        <div className="text-lg font-bold text-success">
                          {formatCurrency(rate.monthly_tuition)}
                        </div>
                        <div className="text-xs text-muted-foreground">Monthly Tuition</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-warning" />
                      <div>
                        <div className="text-lg font-bold text-warning">
                          {formatCurrency(rate.registration_fee)}
                        </div>
                        <div className="text-xs text-muted-foreground">Registration Fee</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 sm:mt-0">
                  <Dialog 
                    open={editingRate === rate.id} 
                    onOpenChange={(open) => !open && setEditingRate(null)}
                  >
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEdit(rate)}
                        className="min-h-[40px]"
                      >
                        <Edit2 className="h-4 w-4 mr-1" />
                        Edit Rates
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[95vw] sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Edit {rate.division} Rates</DialogTitle>
                        <DialogDescription>Update tuition and registration fees</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="monthly_tuition">Monthly Tuition *</Label>
                          <Input
                            id="monthly_tuition"
                            type="number"
                            step="0.01"
                            value={formData.monthly_tuition}
                            onChange={(e) => setFormData(prev => ({ ...prev, monthly_tuition: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="registration_fee">Registration Fee *</Label>
                          <Input
                            id="registration_fee"
                            type="number"
                            step="0.01"
                            value={formData.registration_fee}
                            onChange={(e) => setFormData(prev => ({ ...prev, registration_fee: e.target.value }))}
                            required
                          />
                        </div>
                        <Button type="submit" disabled={updateRate.isPending} className="w-full">
                          {updateRate.isPending ? 'Updating...' : 'Update Rates'}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No tuition rates found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TuitionRatesManager;