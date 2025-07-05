import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, FileText, Send, Eye, Download, Plus, Search, Filter, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';

const Documents = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [documentTitle, setDocumentTitle] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Fetch documents
  const { data: documents, isLoading: documentsLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documents')
        .select(`
          *,
          student:students(first_name, last_name),
          template:document_templates(name, category)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch document templates
  const { data: templates } = useQuery({
    queryKey: ['document_templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('document_templates')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch students
  const { data: students } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select('id, first_name, last_name')
        .eq('status', 'Active')
        .order('last_name');
      
      if (error) throw error;
      return data;
    }
  });

  // Create document mutation
  const createDocumentMutation = useMutation({
    mutationFn: async ({ studentId, templateId, title }: { studentId: string; templateId: string; title: string }) => {
      // Get template content
      const { data: template, error: templateError } = await supabase
        .from('document_templates')
        .select('html_content, requires_signature')
        .eq('id', templateId)
        .single();

      if (templateError) throw templateError;

      // Create document
      const { data, error } = await supabase
        .from('documents')
        .insert({
          title,
          student_id: studentId,
          template_id: templateId,
          html_content: template.html_content,
          status: 'Draft'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      setIsCreateDialogOpen(false);
      setSelectedStudent('');
      setSelectedTemplate('');
      setDocumentTitle('');
      toast({
        title: "Document Created",
        description: "Document has been created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create document",
        variant: "destructive",
      });
    }
  });

  // Send document mutation
  const sendDocumentMutation = useMutation({
    mutationFn: async (documentId: string) => {
      const { error } = await supabase
        .from('documents')
        .update({ 
          status: 'Sent',
          sent_at: new Date().toISOString()
        })
        .eq('id', documentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast({
        title: "Document Sent",
        description: "Document has been sent to the parent",
      });
    }
  });

  const handleCreateDocument = () => {
    if (!selectedStudent || !selectedTemplate || !documentTitle) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    createDocumentMutation.mutate({
      studentId: selectedStudent,
      templateId: selectedTemplate,
      title: documentTitle
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'status-active';
      case 'Sent': return 'status-pending';
      case 'Draft': return 'bg-muted';
      case 'Expired': return 'status-inactive';
      default: return 'bg-muted';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'Sent': return <Send className="h-4 w-4 text-primary" />;
      case 'Draft': return <Clock className="h-4 w-4 text-muted-foreground" />;
      case 'Expired': return <AlertCircle className="h-4 w-4 text-destructive" />;
      default: return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'consent': return 'bg-blue-100 text-blue-800';
      case 'waiver': return 'bg-red-100 text-red-800';
      case 'medical': return 'bg-green-100 text-green-800';
      case 'registration': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white">Document Management</h1>
            <p className="text-white/80">Create, send, and track documents and forms</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">
                {documents?.filter(d => d.status === 'Draft').length || 0}
              </div>
              <p className="text-sm text-muted-foreground">Draft Documents</p>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-warning">
                {documents?.filter(d => d.status === 'Sent').length || 0}
              </div>
              <p className="text-sm text-muted-foreground">Awaiting Response</p>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-success">
                {documents?.filter(d => d.status === 'Completed').length || 0}
              </div>
              <p className="text-sm text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-destructive">
                {documents?.filter(d => d.status === 'Expired').length || 0}
              </div>
              <p className="text-sm text-muted-foreground">Expired</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="documents" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="documents">All Documents</TabsTrigger>
            <TabsTrigger value="templates">Document Templates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="documents" className="mt-6">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Documents</CardTitle>
                    <CardDescription>Manage student documents and forms</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search documents..." className="pl-10 w-64" />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4" />
                    </Button>
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="elegant">
                          <Plus className="h-4 w-4 mr-2" />
                          Create Document
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Create New Document</DialogTitle>
                          <DialogDescription>
                            Generate a new document from a template for a student
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">Student</label>
                            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a student" />
                              </SelectTrigger>
                              <SelectContent>
                                {students?.map((student) => (
                                  <SelectItem key={student.id} value={student.id}>
                                    {student.first_name} {student.last_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Template</label>
                            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a template" />
                              </SelectTrigger>
                              <SelectContent>
                                {templates?.map((template) => (
                                  <SelectItem key={template.id} value={template.id}>
                                    {template.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Document Title</label>
                            <Input
                              value={documentTitle}
                              onChange={(e) => setDocumentTitle(e.target.value)}
                              placeholder="Enter document title"
                            />
                          </div>
                          <Button 
                            onClick={handleCreateDocument} 
                            disabled={createDocumentMutation.isPending}
                            className="w-full"
                          >
                            {createDocumentMutation.isPending ? "Creating..." : "Create Document"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {documentsLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="p-4 rounded-lg border">
                        <Skeleton className="h-4 w-64 mb-2" />
                        <Skeleton className="h-3 w-32 mb-2" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    ))}
                  </div>
                ) : documents && documents.length > 0 ? (
                  <div className="space-y-4">
                    {documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-smooth">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(doc.status || 'Draft')}
                            <p className="font-medium">{doc.title}</p>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {doc.student ? `${doc.student.first_name} ${doc.student.last_name}` : 'No student assigned'}
                          </p>
                          <div className="flex items-center gap-2">
                            <p className="text-xs text-muted-foreground">
                              Created {new Date(doc.created_at!).toLocaleDateString()}
                            </p>
                            {doc.template && (
                              <Badge className={getCategoryColor(doc.template.category)} variant="outline">
                                {doc.template.name}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(doc.status || 'Draft')}>
                            {doc.status}
                          </Badge>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {doc.status === 'Draft' && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => sendDocumentMutation.mutate(doc.id)}
                                disabled={sendDocumentMutation.isPending}
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            )}
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No documents created yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="mt-6">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Document Templates</CardTitle>
                    <CardDescription>Manage reusable document templates</CardDescription>
                  </div>
                  <Button variant="elegant">
                    <Plus className="h-4 w-4 mr-2" />
                    New Template
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {templates && templates.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {templates.map((template) => (
                      <Card key={template.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium">{template.name}</h3>
                            <Badge className={getCategoryColor(template.category)} variant="outline">
                              {template.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {template.requires_signature ? 'Requires signature' : 'Information only'}
                          </p>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Eye className="h-4 w-4 mr-1" />
                              Preview
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1">
                              Edit
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No templates available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Documents;