import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Edit2, DollarSign } from 'lucide-react';
import { usePaymentCategories, useCreatePaymentCategory, useUpdatePaymentCategory } from '@/hooks/usePaymentCategories';

const PaymentCategoryManager = () => {
  const { data: categories, isLoading } = usePaymentCategories();
  const createCategory = useCreatePaymentCategory();
  const updateCategory = useUpdatePaymentCategory();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    default_amount: '',
    division_specific: false,
    sort_order: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const categoryData = {
      ...formData,
      default_amount: formData.default_amount ? parseFloat(formData.default_amount) : null,
      is_active: true
    };

    if (editingCategory) {
      await updateCategory.mutateAsync({ id: editingCategory, ...categoryData });
      setEditingCategory(null);
    } else {
      await createCategory.mutateAsync(categoryData);
      setIsCreateOpen(false);
    }
    
    setFormData({ name: '', description: '', default_amount: '', division_specific: false, sort_order: 0 });
  };

  const handleEdit = (category: any) => {
    setFormData({
      name: category.name,
      description: category.description || '',
      default_amount: category.default_amount?.toString() || '',
      division_specific: category.division_specific,
      sort_order: category.sort_order
    });
    setEditingCategory(category.id);
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return 'Variable';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Payment Categories</CardTitle>
            <CardDescription>Manage payment types and their default amounts</CardDescription>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button variant="elegant">
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create Payment Category</DialogTitle>
                <DialogDescription>Add a new payment category for your studio</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Category Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="default_amount">Default Amount</Label>
                  <Input
                    id="default_amount"
                    type="number"
                    step="0.01"
                    value={formData.default_amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, default_amount: e.target.value }))}
                    placeholder="Leave empty for variable amounts"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="division_specific"
                    checked={formData.division_specific}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, division_specific: checked }))}
                  />
                  <Label htmlFor="division_specific">Division-specific pricing</Label>
                </div>
                <Button type="submit" disabled={createCategory.isPending} className="w-full">
                  {createCategory.isPending ? 'Creating...' : 'Create Category'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-3 border rounded-lg">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-48" />
              </div>
            ))}
          </div>
        ) : categories && categories.length > 0 ? (
          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-smooth">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-medium">{category.name}</h3>
                    {category.division_specific && (
                      <Badge variant="outline" className="text-xs">Division-specific</Badge>
                    )}
                  </div>
                  {category.description && (
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  )}
                  <div className="flex items-center gap-1 text-sm font-medium text-success">
                    <DollarSign className="h-3 w-3" />
                    {formatCurrency(category.default_amount)}
                  </div>
                </div>
                <div className="flex gap-2 mt-3 sm:mt-0">
                  <Dialog 
                    open={editingCategory === category.id} 
                    onOpenChange={(open) => !open && setEditingCategory(null)}
                  >
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEdit(category)}
                        className="min-h-[40px]"
                      >
                        <Edit2 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[95vw] sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Edit Payment Category</DialogTitle>
                        <DialogDescription>Update the payment category details</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="edit-name">Category Name *</Label>
                          <Input
                            id="edit-name"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-description">Description</Label>
                          <Textarea
                            id="edit-description"
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            rows={2}
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-default_amount">Default Amount</Label>
                          <Input
                            id="edit-default_amount"
                            type="number"
                            step="0.01"
                            value={formData.default_amount}
                            onChange={(e) => setFormData(prev => ({ ...prev, default_amount: e.target.value }))}
                            placeholder="Leave empty for variable amounts"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="edit-division_specific"
                            checked={formData.division_specific}
                            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, division_specific: checked }))}
                          />
                          <Label htmlFor="edit-division_specific">Division-specific pricing</Label>
                        </div>
                        <Button type="submit" disabled={updateCategory.isPending} className="w-full">
                          {updateCategory.isPending ? 'Updating...' : 'Update Category'}
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
            <p className="text-muted-foreground">No payment categories found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentCategoryManager;