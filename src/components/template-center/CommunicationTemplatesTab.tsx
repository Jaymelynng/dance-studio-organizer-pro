import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Eye, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TemplateBuilder } from '@/components/template-builder/TemplateBuilder';

interface CommunicationTemplate {
  id: string;
  name: string;
  subject: string;
  category: string;
  html_content: string;
  variables: string[] | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const CommunicationTemplatesTab = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<CommunicationTemplate | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    category: '',
    html_content: '',
    variables: [] as string[],
    is_active: true
  });

  // Fetch templates
  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['communication-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('communication_templates')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as CommunicationTemplate[];
    }
  });

  // Create/Update template mutation
  const saveMutation = useMutation({
    mutationFn: async (templateData: typeof formData) => {
      if (editingTemplate) {
        const { error } = await supabase
          .from('communication_templates')
          .update(templateData)
          .eq('id', editingTemplate.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('communication_templates')
          .insert([templateData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communication-templates'] });
      setIsDialogOpen(false);
      resetForm();
      toast({
        title: editingTemplate ? 'Template Updated' : 'Template Created',
        description: `Communication template has been ${editingTemplate ? 'updated' : 'created'} successfully.`
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
        .from('communication_templates')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communication-templates'] });
      toast({
        title: 'Template Deleted',
        description: 'Communication template has been deleted successfully.'
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
      subject: '',
      category: '',
      html_content: '',
      variables: [],
      is_active: true
    });
    setEditingTemplate(null);
  };

  const openEditDialog = (template: CommunicationTemplate) => {
    setFormData({
      name: template.name,
      subject: template.subject,
      category: template.category,
      html_content: template.html_content,
      variables: template.variables || [],
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
      case 'payment': return 'bg-amber-100 text-amber-800';
      case 'enrollment': return 'bg-blue-100 text-blue-800';
      case 'general': return 'bg-gray-100 text-gray-800';
      case 'marketing': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Communication Templates</h2>
          <p className="text-white/70">Manage email templates for different types of communications</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              New Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-full max-h-[90vh] h-[90vh]">
            <DialogHeader>
              <DialogTitle>
                {editingTemplate ? 'Edit Template' : 'Create New Template'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="h-full">
              <TemplateBuilder
                templateType="email"
                onSave={(template) => {
                  const templateData = {
                    name: template.name,
                    subject: formData.subject || 'New Email Template',
                    category: formData.category || 'general',
                    html_content: template.html,
                    variables: [],
                    is_active: formData.is_active
                  };
                  saveMutation.mutate(templateData);
                }}
              />
            </div>
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
                      <Mail className="h-5 w-5" />
                      {template.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{template.subject}</p>
                  </div>
                  <div className="flex gap-1">
                    <Badge className={getCategoryColor(template.category)}>
                      {template.category}
                    </Badge>
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
                        <div className="space-y-4">
                          <div>
                            <Label>Subject</Label>
                            <div className="p-2 bg-muted rounded">{template.subject}</div>
                          </div>
                          <div>
                            <Label>Content</Label>
                            <div 
                              className="border rounded-lg p-4 max-h-96 overflow-y-auto bg-white"
                              dangerouslySetInnerHTML={{ __html: template.html_content }}
                            />
                          </div>
                        </div>
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
              <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Communication Templates</h3>
              <p className="text-muted-foreground mb-4">Create your first email template to get started</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};