import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Mail, 
  Send, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Search,
  Filter,
  Users,
  DollarSign,
  Calendar
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const Communications = () => {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [recipients, setRecipients] = useState<string[]>([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendingReminders, setSendingReminders] = useState(false);

  // Fetch communications
  const { data: communications, isLoading: communicationsLoading, refetch: refetchCommunications } = useQuery({
    queryKey: ['communications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('communications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch templates
  const { data: templates, isLoading: templatesLoading } = useQuery({
    queryKey: ['communication_templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('communication_templates')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch parents for recipient selection
  const { data: parents } = useQuery({
    queryKey: ['parents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('parents')
        .select('id, first_name, last_name, email')
        .order('last_name');
      
      if (error) throw error;
      return data;
    }
  });

  const handleSendPaymentReminders = async () => {
    setSendingReminders(true);
    try {
      const response = await supabase.functions.invoke('send-payment-reminder', {
        body: { send_all_overdue: true }
      });

      if (response.error) throw response.error;

      toast({
        title: "Payment Reminders Sent",
        description: `Successfully sent ${response.data.reminders_sent} payment reminders`,
      });

      refetchCommunications();
    } catch (error) {
      console.error('Error sending payment reminders:', error);
      toast({
        title: "Error",
        description: "Failed to send payment reminders",
        variant: "destructive",
      });
    } finally {
      setSendingReminders(false);
    }
  };

  const handleSendCommunication = async () => {
    if (!subject || !message || recipients.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and select recipients",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      // Create communication record
      const { data: communication, error: commError } = await supabase
        .from('communications')
        .insert({
          subject,
          html_content: message.replace(/\n/g, '<br>'),
          recipient_emails: recipients,
          status: 'Draft'
        })
        .select()
        .single();

      if (commError) throw commError;

      // Send email
      const response = await supabase.functions.invoke('send-email', {
        body: {
          to: recipients,
          subject,
          html_content: message.replace(/\n/g, '<br>'),
          communication_id: communication.id
        }
      });

      if (response.error) throw response.error;

      toast({
        title: "Communication Sent",
        description: `Successfully sent to ${recipients.length} recipient(s)`,
      });

      // Reset form
      setSubject("");
      setMessage("");
      setRecipients([]);
      setSelectedTemplate("");
      refetchCommunications();

    } catch (error) {
      console.error('Error sending communication:', error);
      toast({
        title: "Error",
        description: "Failed to send communication",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Sent': return 'status-active';
      case 'Draft': return 'status-pending';
      case 'Failed': return 'status-inactive';
      default: return 'bg-muted';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Sent': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'Draft': return <Clock className="h-4 w-4 text-warning" />;
      case 'Failed': return <AlertCircle className="h-4 w-4 text-destructive" />;
      default: return <Mail className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <h1 className="text-4xl font-bold text-white mb-2">Communications Hub</h1>
          <p className="text-white/90 text-lg">
            Manage emails, reminders, and parent communications
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="shadow-card">
            <CardContent className="p-6 text-center">
              <DollarSign className="h-8 w-8 text-warning mx-auto mb-2" />
              <h3 className="font-semibold mb-2">Payment Reminders</h3>
              <Button 
                variant="professional" 
                size="sm" 
                onClick={handleSendPaymentReminders}
                disabled={sendingReminders}
              >
                {sendingReminders ? "Sending..." : "Send Overdue Reminders"}
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-2">Bulk Communication</h3>
              <Button variant="professional" size="sm">
                Send to All Parents
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 text-success mx-auto mb-2" />
              <h3 className="font-semibold mb-2">Schedule Report</h3>
              <Button variant="professional" size="sm">
                Send Weekly Report
              </Button>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="send" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="send">Send Communication</TabsTrigger>
            <TabsTrigger value="history">Communication History</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="send" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>New Communication</CardTitle>
                <CardDescription>Send emails to parents and students</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Template (Optional)</label>
                    <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a template" />
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
                    <label className="text-sm font-medium mb-2 block">Recipients</label>
                    <Select onValueChange={(value) => {
                      if (value && !recipients.includes(value)) {
                        setRecipients([...recipients, value]);
                      }
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Add recipients" />
                      </SelectTrigger>
                      <SelectContent>
                        {parents?.map((parent) => (
                          <SelectItem key={parent.id} value={parent.email}>
                            {parent.first_name} {parent.last_name} ({parent.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {recipients.length > 0 && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Selected Recipients:</label>
                    <div className="flex flex-wrap gap-2">
                      {recipients.map((email) => (
                        <Badge key={email} variant="secondary" className="px-2 py-1">
                          {email}
                          <button
                            onClick={() => setRecipients(recipients.filter(r => r !== email))}
                            className="ml-2 text-muted-foreground hover:text-foreground"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium mb-2 block">Subject</label>
                  <Input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Email subject"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Message</label>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Your message..."
                    rows={8}
                  />
                </div>

                <Button 
                  onClick={handleSendCommunication} 
                  disabled={isSending}
                  className="w-full"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isSending ? "Sending..." : "Send Communication"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Communication History</CardTitle>
                    <CardDescription>Track all sent communications</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search communications..." className="pl-10 w-64" />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {communicationsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="p-4 rounded-lg border">
                        <Skeleton className="h-4 w-64 mb-2" />
                        <Skeleton className="h-3 w-32 mb-2" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    ))}
                  </div>
                ) : communications && communications.length > 0 ? (
                  <div className="space-y-4">
                    {communications.map((comm) => (
                      <div key={comm.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-smooth">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(comm.status || 'Draft')}
                            <p className="font-medium">{comm.subject}</p>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            To: {comm.recipient_emails.join(', ')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {comm.sent_at ? 
                              `Sent ${new Date(comm.sent_at).toLocaleDateString()}` : 
                              `Created ${new Date(comm.created_at!).toLocaleDateString()}`
                            }
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(comm.status || 'Draft')}>
                            {comm.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {comm.recipient_emails.length} recipient{comm.recipient_emails.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No communications sent yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Template Builder</CardTitle>
                    <CardDescription>Create beautiful, branded email templates with drag & drop</CardDescription>
                  </div>
                  <Button variant="elegant" onClick={() => window.open('/template-builder?type=email', '_blank')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Open Template Builder
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {templatesLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="p-4 rounded-lg border">
                        <Skeleton className="h-4 w-48 mb-2" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    ))}
                  </div>
                ) : templates && templates.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {templates.map((template) => (
                      <div key={template.id} className="p-4 rounded-lg border hover:bg-muted/50 transition-smooth">
                        <h3 className="font-medium mb-2">{template.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{template.subject}</p>
                        <Badge variant="outline">{template.category}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
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

export default Communications;