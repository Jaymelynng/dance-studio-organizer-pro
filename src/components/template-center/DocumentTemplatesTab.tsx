import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Eye, FileText, PenTool } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface DocumentTemplate {
  id: string;
  name: string;
  category: string;
  html_content: string;
  variables: string[] | null;
  requires_signature: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const DocumentTemplatesTab = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<DocumentTemplate | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    html_content: '',
    variables: [] as string[],
    requires_signature: false,
    is_active: true
  });

  // Fetch templates
  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['document-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('document_templates')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as DocumentTemplate[];
    }
  });

  // Create/Update template mutation
  const saveMutation = useMutation({
    mutationFn: async (templateData: typeof formData) => {
      if (editingTemplate) {
        const { error } = await supabase
          .from('document_templates')
          .update(templateData)
          .eq('id', editingTemplate.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('document_templates')
          .insert([templateData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-templates'] });
      setIsDialogOpen(false);
      resetForm();
      toast({
        title: editingTemplate ? 'Template Updated' : 'Template Created',
        description: `Document template has been ${editingTemplate ? 'updated' : 'created'} successfully.`
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to ${editingTemplate ? 'update' : 'create'} template: ${error.message}`
      });
    }
  });

  // Delete template mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('document_templates')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-templates'] });
      toast({
        title: 'Template Deleted',
        description: 'Document template has been deleted successfully.'
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to delete template: ${error.message}`
      });
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      html_content: '',
      variables: [],
      requires_signature: false,
      is_active: true
    });
    setEditingTemplate(null);
  };

  const openEditDialog = (template: DocumentTemplate) => {
    setFormData({
      name: template.name,
      category: template.category,
      html_content: template.html_content,
      variables: template.variables || [],
      requires_signature: template.requires_signature,
      is_active: template.is_active
    });
    setEditingTemplate(template);
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'consent': return 'bg-red-100 text-red-800';
      case 'waiver': return 'bg-orange-100 text-orange-800';
      case 'agreement': return 'bg-blue-100 text-blue-800';
      case 'medical': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Document Templates</h2>
          <p className="text-white/70">Manage templates for waivers, consent forms, and other documents</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              New Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTemplate ? 'Edit Template' : 'Create New Template'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Template Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Photography Consent Form"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consent">Consent</SelectItem>
                      <SelectItem value="waiver">Waiver</SelectItem>
                      <SelectItem value="agreement">Agreement</SelectItem>
                      <SelectItem value="medical">Medical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="content">Document Content (HTML)</Label>
                <Textarea
                  id="content"
                  value={formData.html_content}
                  onChange={(e) => setFormData({ ...formData, html_content: e.target.value })}
                  placeholder="Enter HTML content for the document template..."
                  className="min-h-[200px] font-mono text-sm"
                  required
                />
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="signature"
                    checked={formData.requires_signature}
                    onCheckedChange={(checked) => setFormData({ ...formData, requires_signature: checked })}
                  />
                  <Label htmlFor="signature">Requires Signature</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="active">Active Template</Label>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? 'Saving...' : (editingTemplate ? 'Update' : 'Create')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="shadow-card hover:shadow-elegant transition-smooth">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <FileText className="h-5 w-5" />
                      {template.name}
                    </CardTitle>
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    <Badge className={getCategoryColor(template.category)}>
                      {template.category}
                    </Badge>
                    {template.requires_signature && (
                      <Badge variant="outline" className="text-xs">
                        <PenTool className="h-3 w-3 mr-1" />
                        Signature
                      </Badge>
                    )}
                    <Badge variant={template.is_active ? "default" : "secondary"}>
                      {template.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    Updated: {new Date(template.updated_at).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Preview: {template.name}</DialogTitle>
                        </DialogHeader>
                        <div 
                          className="border rounded-lg p-4 max-h-96 overflow-y-auto bg-white"
                          dangerouslySetInnerHTML={{ __html: template.html_content }}
                        />
                      </DialogContent>
                    </Dialog>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(template)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteMutation.mutate(template.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {templates.length === 0 && (
            <div className="col-span-full text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Document Templates</h3>
              <p className="text-muted-foreground mb-4">Create your first document template to get started</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};