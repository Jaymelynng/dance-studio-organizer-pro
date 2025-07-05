import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-picker';
import { Mail, Send, Eye, MousePointer, AlertCircle, Download, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DateRange } from 'react-day-picker';
import { startOfMonth, endOfMonth } from 'date-fns';

export const CommunicationReportsTab = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date())
  });
  const [status, setStatus] = useState<string>('all');

  // Fetch communications data
  const { data: communicationsData, isLoading } = useQuery({
    queryKey: ['communication-reports', dateRange, status],
    queryFn: async () => {
      const fromDate = dateRange?.from?.toISOString();
      const toDate = dateRange?.to?.toISOString();

      let query = supabase
        .from('communications')
        .select(`
          *,
          template:communication_templates(name, category),
          recipients:communication_recipients(*)
        `);

      if (fromDate) query = query.gte('created_at', fromDate);
      if (toDate) query = query.lte('created_at', toDate);
      if (status !== 'all') query = query.eq('status', status as any);

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const calculateMetrics = () => {
    if (!communicationsData) return {
      total: 0,
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      failed: 0,
      openRate: 0,
      clickRate: 0,
      deliveryRate: 0
    };

    const total = communicationsData.length;
    const sent = communicationsData.filter(c => c.status === 'Sent' || c.status === 'Delivered').length;
    const delivered = communicationsData.filter(c => c.status === 'Delivered').length;
    const failed = communicationsData.filter(c => c.status === 'Failed').length;

    // Calculate aggregate stats from delivery_stats
    let totalOpened = 0;
    let totalClicked = 0;
    let totalSentRecipients = 0;

    communicationsData.forEach(comm => {
      if (comm.delivery_stats) {
        const stats = comm.delivery_stats as any;
        totalOpened += stats.opened || 0;
        totalClicked += stats.clicked || 0;
        totalSentRecipients += stats.sent || 0;
      }
    });

    const openRate = totalSentRecipients > 0 ? (totalOpened / totalSentRecipients) * 100 : 0;
    const clickRate = totalOpened > 0 ? (totalClicked / totalOpened) * 100 : 0;
    const deliveryRate = total > 0 ? (sent / total) * 100 : 0;

    return {
      total,
      sent,
      delivered,
      opened: totalOpened,
      clicked: totalClicked,
      failed,
      openRate,
      clickRate,
      deliveryRate
    };
  };

  const metrics = calculateMetrics();

  const exportReport = () => {
    const csvContent = [
      ['Communication Report'],
      ['Generated:', new Date().toLocaleDateString()],
      ['Period:', `${dateRange?.from?.toLocaleDateString()} - ${dateRange?.to?.toLocaleDateString()}`],
      [],
      ['Summary'],
      ['Total Communications', metrics.total.toString()],
      ['Sent', metrics.sent.toString()],
      ['Delivered', metrics.delivered.toString()],
      ['Opened', metrics.opened.toString()],
      ['Clicked', metrics.clicked.toString()],
      ['Failed', metrics.failed.toString()],
      ['Delivery Rate', `${metrics.deliveryRate.toFixed(1)}%`],
      ['Open Rate', `${metrics.openRate.toFixed(1)}%`],
      ['Click Rate', `${metrics.clickRate.toFixed(1)}%`],
      [],
      ['Communication Details'],
      ['Date', 'Subject', 'Template', 'Status', 'Recipients', 'Delivered', 'Opened', 'Clicked']
    ];

    communicationsData?.forEach(comm => {
      const stats = comm.delivery_stats as any || {};
      csvContent.push([
        comm.created_at ? new Date(comm.created_at).toLocaleDateString() : '',
        comm.subject,
        comm.template?.name || 'Custom',
        comm.status || 'Draft',
        comm.recipient_emails.length.toString(),
        (stats.delivered || 0).toString(),
        (stats.opened || 0).toString(),
        (stats.clicked || 0).toString()
      ]);
    });

    const csv = csvContent.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `communication-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Sent":
      case "Delivered": return "status-active";
      case "Draft": return "status-pending";
      case "Failed": return "status-inactive";
      default: return "bg-muted";
    }
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
          <h2 className="text-2xl font-bold text-white">Communication Reports</h2>
          <p className="text-white/70">Email delivery, engagement, and performance analytics</p>
        </div>
        <div className="flex gap-4">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Sent">Sent</SelectItem>
              <SelectItem value="Delivered">Delivered</SelectItem>
              <SelectItem value="Failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          <Button onClick={exportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Communication Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{metrics.sent}</div>
            <p className="text-xs text-muted-foreground">
              Communications sent
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {metrics.deliveryRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully delivered
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
            <Eye className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {metrics.openRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Emails opened
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
            <MousePointer className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {metrics.clickRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Links clicked
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Communications */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Recent Communications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse flex justify-between items-center p-3 border rounded">
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-200 rounded w-48"></div>
                      <div className="h-3 bg-gray-200 rounded w-32"></div>
                    </div>
                    <div className="h-5 bg-gray-200 rounded w-16"></div>
                  </div>
                ))
              ) : communicationsData?.slice(0, 5).map((comm) => {
                const stats = comm.delivery_stats as any || {};
                return (
                  <div key={comm.id} className="flex justify-between items-center p-3 border rounded hover:bg-muted/50">
                    <div className="flex-1">
                      <p className="font-medium">{comm.subject}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-muted-foreground">
                          {comm.created_at ? new Date(comm.created_at).toLocaleDateString() : 'No date'}
                        </p>
                        {comm.template && (
                          <Badge className={getCategoryColor(comm.template.category)} variant="outline">
                            {comm.template.name}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(comm.status || 'Draft')}>
                        {comm.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {comm.recipient_emails.length} recipients
                      </p>
                    </div>
                  </div>
                );
              }) || (
                <p className="text-muted-foreground text-center py-8">No communications in selected period</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Performance Breakdown */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Delivery Rate</span>
                  <span className="text-sm text-muted-foreground">{metrics.deliveryRate.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-success h-2 rounded-full" 
                    style={{ width: `${Math.min(metrics.deliveryRate, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Open Rate</span>
                  <span className="text-sm text-muted-foreground">{metrics.openRate.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${Math.min(metrics.openRate, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Click Rate</span>
                  <span className="text-sm text-muted-foreground">{metrics.clickRate.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-warning h-2 rounded-full" 
                    style={{ width: `${Math.min(metrics.clickRate, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">{metrics.opened}</div>
                  <div className="text-xs text-muted-foreground">Total Opens</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-warning">{metrics.clicked}</div>
                  <div className="text-xs text-muted-foreground">Total Clicks</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Communications List */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Communication History ({communicationsData?.length || 0} communications)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              [...Array(10)].map((_, i) => (
                <div key={i} className="animate-pulse flex justify-between items-center p-4 border rounded">
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-64"></div>
                    <div className="h-3 bg-gray-200 rounded w-48"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-5 bg-gray-200 rounded w-20"></div>
                    <div className="h-5 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              ))
            ) : communicationsData?.length ? (
              communicationsData.map((comm) => {
                const stats = comm.delivery_stats as any || {};
                return (
                  <div key={comm.id} className="flex justify-between items-center p-4 border rounded hover:bg-muted/50">
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{comm.subject}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {comm.created_at ? new Date(comm.created_at).toLocaleDateString() : 'No date'} • 
                            {comm.recipient_emails.length} recipients
                          </p>
                          {comm.template && (
                            <Badge className={getCategoryColor(comm.template.category)} variant="outline">
                              {comm.template.name}
                            </Badge>
                          )}
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(comm.status || 'Draft')}>
                            {comm.status}
                          </Badge>
                          {comm.status === 'Sent' || comm.status === 'Delivered' ? (
                            <div className="text-xs text-muted-foreground mt-2 space-y-1">
                              <div>📧 {stats.delivered || 0} delivered</div>
                              <div>👁️ {stats.opened || 0} opened</div>
                              <div>🖱️ {stats.clicked || 0} clicked</div>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No communications found for the selected criteria
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};