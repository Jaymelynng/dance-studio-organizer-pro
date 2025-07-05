import { useState } from 'react';
import { useContractTemplates } from '@/hooks/useContractTemplates';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Plus, Edit, Trash2, Eye } from 'lucide-react';

interface EnglishFormData {
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

export const ContractTemplatesPage = () => {
  const { templates, loading, createTemplate, updateTemplate, deleteTemplate } = useContractTemplates();
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    division: 'All',
    season: '2025/2026',
    html_content: ''
  });

  const [englishFormData, setEnglishFormData] = useState<EnglishFormData>({
    companyName: 'Degagé Classical Ballet',
    season: '2025/2026',
    seasonStartDate: '',
    seasonEndDate: '',
    terminationNotice: '30',
    dismissalPeriod: '30',
    professionalFee: '1800',
    preProFee: '1400',
    supplementalFee: '390',
    paymentDueDate: '1st',
    invoiceSendDate: '25th',
    lateFee: '35',
    lateGracePeriod: '3',
    attendancePolicy: 'Students are required to maintain regular attendance for optimal progress.',
    injuryPolicy: 'Students must inform instructors of any injuries or physical limitations.',
    conductPolicy: 'Students are expected to maintain appropriate behavior and respect for others.',
    directorEmail: 'cody@degageclassical.com',
    studioContact: 'Degagé Classical Ballet'
  });

  // Function to generate HTML from English form data
  const generateHtmlFromEnglish = (englishData: EnglishFormData): string => {
    return `
<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #2c3e50; margin-bottom: 10px;">${englishData.companyName}</h1>
    <h2 style="color: #34495e; font-weight: normal;">Student Enrollment Agreement</h2>
    <h3 style="color: #7f8c8d; font-weight: normal;">${englishData.season} Season</h3>
  </div>

  <div style="margin-bottom: 25px;">
    <h3 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 5px;">Student Information</h3>
    <p><strong>Student Name:</strong> {{student_name}}</p>
    <p><strong>Date of Birth:</strong> {{student_dob}}</p>
    <p><strong>Division:</strong> {{division}}</p>
  </div>

  <div style="margin-bottom: 25px;">
    <h3 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 5px;">Parent/Guardian Information</h3>
    <p><strong>Parent/Guardian Name:</strong> {{parent_names}}</p>
    <p><strong>Address:</strong> {{parent_address}}</p>
    <p><strong>Phone:</strong> {{parent_phone}}</p>
    <p><strong>Email:</strong> {{parent_email}}</p>
  </div>

  <div style="margin-bottom: 25px;">
    <h3 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 5px;">Enrollment Agreement</h3>
    <p>This agreement is for the ${englishData.season} dance season${englishData.seasonStartDate && englishData.seasonEndDate ? ` (${englishData.seasonStartDate} - ${englishData.seasonEndDate})` : ''}.</p>
    <p>Early termination requires ${englishData.terminationNotice} days written notice. Students dismissed for behavioral reasons remain financially responsible for ${englishData.dismissalPeriod} days following dismissal.</p>
  </div>

  <div style="margin-bottom: 25px;">
    <h3 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 5px;">Tuition & Fees</h3>
    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
      <h4 style="margin-top: 0; color: #2c3e50;">Monthly Tuition Rates:</h4>
      <ul style="margin-bottom: 0;">
        <li><strong>Professional Division:</strong> $${englishData.professionalFee}</li>
        <li><strong>Pre-Professional Division:</strong> $${englishData.preProFee}</li>
        <li><strong>Supplemental Division:</strong> $${englishData.supplementalFee}</li>
      </ul>
    </div>
    <p><strong>Your Monthly Tuition:</strong> $\{\{monthly_tuition\}\}</p>
    <p>Tuition is due on the ${englishData.paymentDueDate} of each month. Invoices will be sent on the ${englishData.invoiceSendDate} of the previous month.</p>
    <p>Late payments incur a $${englishData.lateFee} fee after ${englishData.lateGracePeriod} days grace period.</p>
  </div>

  <div style="margin-bottom: 25px;">
    <h3 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 5px;">Studio Policies</h3>
    
    <h4 style="color: #34495e;">Attendance Policy</h4>
    <p>${englishData.attendancePolicy}</p>
    
    <h4 style="color: #34495e;">Injury Policy</h4>
    <p>${englishData.injuryPolicy}</p>
    
    <h4 style="color: #34495e;">Student Conduct</h4>
    <p>${englishData.conductPolicy}</p>
  </div>

  <div style="margin-bottom: 25px;">
    <h3 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 5px;">Contact Information</h3>
    <p><strong>Program Director:</strong> ${englishData.directorEmail}</p>
    <p><strong>Studio:</strong> ${englishData.studioContact}</p>
  </div>

  <div style="margin-top: 40px; border-top: 1px solid #bdc3c7; padding-top: 20px;">
    <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
      <div style="width: 45%;">
        <p><strong>Parent/Guardian Signature:</strong></p>
        <div style="border-bottom: 1px solid #000; height: 40px; margin-bottom: 10px;"></div>
        <p>Date: ________________</p>
      </div>
      <div style="width: 45%;">
        <p><strong>Student Signature (if 18+):</strong></p>
        <div style="border-bottom: 1px solid #000; height: 40px; margin-bottom: 10px;"></div>
        <p>Date: ________________</p>
      </div>
    </div>
    <div style="text-align: center;">
      <p><strong>Director Signature:</strong></p>
      <div style="border-bottom: 1px solid #000; height: 40px; margin: 10px auto; width: 300px;"></div>
      <p>Date: ________________</p>
    </div>
  </div>
</div>`;
  };

  // Function to parse HTML and extract English form data (basic implementation)
  const parseHtmlToEnglish = (html: string): Partial<EnglishFormData> => {
    // This is a simplified parser - in a real app you'd want more robust parsing
    const parsed: Partial<EnglishFormData> = {};
    
    // Extract company name
    const companyMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
    if (companyMatch) parsed.companyName = companyMatch[1].trim();
    
    // Extract season
    const seasonMatch = html.match(/(\d{4}\/\d{4})/);
    if (seasonMatch) parsed.season = seasonMatch[1];
    
    return parsed;
  };

  const handleCreateTemplate = async () => {
    try {
      await createTemplate({
        ...formData,
        is_active: true
      });
      setFormData({ name: '', division: 'All', season: '2025/2026', html_content: '' });
    } catch (error) {
      console.error('Error creating template:', error);
    }
  };

  const handleUpdateTemplate = async () => {
    if (!selectedTemplate) return;
    try {
      await updateTemplate(selectedTemplate.id, formData);
      setSelectedTemplate(null);
      setIsEditMode(false);
    } catch (error) {
      console.error('Error updating template:', error);
    }
  };

  const startEdit = (template: any) => {
    setSelectedTemplate(template);
    setFormData({
      name: template.name,
      division: template.division,
      season: template.season,
      html_content: template.html_content
    });
    
    // Try to parse HTML and populate English form
    const parsedEnglish = parseHtmlToEnglish(template.html_content);
    setEnglishFormData(prev => ({
      ...prev,
      ...parsedEnglish,
      season: template.season
    }));
    
    setIsEditMode(true);
  };

  // Handler for English form changes
  const handleEnglishFormChange = (field: keyof EnglishFormData, value: string) => {
    const updatedEnglishData = { ...englishFormData, [field]: value };
    setEnglishFormData(updatedEnglishData);
    
    // Auto-generate HTML from English form
    const generatedHtml = generateHtmlFromEnglish(updatedEnglishData);
    setFormData(prev => ({ ...prev, html_content: generatedHtml }));
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Contract Templates</h1>
          <p className="text-muted-foreground">Manage contract templates for different divisions and seasons</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Contract Template</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Template Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Parent Contract 2025/2026"
                  />
                </div>
                <div>
                  <Label htmlFor="season">Season</Label>
                  <Input
                    id="season"
                    value={formData.season}
                    onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                    placeholder="e.g., 2025/2026"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="division">Division</Label>
                <Select
                  value={formData.division}
                  onValueChange={(value) => setFormData({ ...formData, division: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Divisions</SelectItem>
                    <SelectItem value="Professional">Professional</SelectItem>
                    <SelectItem value="Pre-Professional">Pre-Professional</SelectItem>
                    <SelectItem value="Supplemental">Supplemental</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="html_content">HTML Content</Label>
                <Textarea
                  id="html_content"
                  value={formData.html_content}
                  onChange={(e) => setFormData({ ...formData, html_content: e.target.value })}
                  placeholder="Paste your HTML contract template here..."
                  className="min-h-[400px] font-mono text-sm"
                />
              </div>
              
              <Button onClick={handleCreateTemplate} disabled={loading}>
                Create Template
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="text-muted-foreground">Loading templates...</div>
        </div>
      ) : (
        <div className="grid gap-6">
          {templates.map((template) => (
            <Card key={template.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {template.name}
                    </CardTitle>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">{template.division}</Badge>
                      <Badge variant="secondary">{template.season}</Badge>
                      <Badge variant={template.is_active ? "default" : "secondary"}>
                        {template.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
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
                          className="border rounded-lg p-4 max-h-96 overflow-y-auto"
                          dangerouslySetInnerHTML={{ __html: template.html_content }}
                        />
                      </DialogContent>
                    </Dialog>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(template)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteTemplate(template.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Created: {new Date(template.created_at).toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  Last updated: {new Date(template.updated_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditMode} onOpenChange={setIsEditMode}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Template: {selectedTemplate?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Template Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-season">Season</Label>
                <Input
                  id="edit-season"
                  value={formData.season}
                  onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="edit-division">Division</Label>
              <Select
                value={formData.division}
                onValueChange={(value) => setFormData({ ...formData, division: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Divisions</SelectItem>
                  <SelectItem value="Professional">Professional</SelectItem>
                  <SelectItem value="Pre-Professional">Pre-Professional</SelectItem>
                  <SelectItem value="Supplemental">Supplemental</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Tabs defaultValue="english" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="english">English Editor</TabsTrigger>
                <TabsTrigger value="edit">Edit HTML</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              
              <TabsContent value="english" className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={englishFormData.companyName}
                      onChange={(e) => handleEnglishFormChange('companyName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="directorEmail">Director Email</Label>
                    <Input
                      id="directorEmail"
                      value={englishFormData.directorEmail}
                      onChange={(e) => handleEnglishFormChange('directorEmail', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="seasonStartDate">Season Start Date (Optional)</Label>
                    <Input
                      id="seasonStartDate"
                      type="date"
                      value={englishFormData.seasonStartDate}
                      onChange={(e) => handleEnglishFormChange('seasonStartDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="seasonEndDate">Season End Date (Optional)</Label>
                    <Input
                      id="seasonEndDate"
                      type="date"
                      value={englishFormData.seasonEndDate}
                      onChange={(e) => handleEnglishFormChange('seasonEndDate', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-3">Enrollment Terms</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="terminationNotice">Early Termination Notice (Days)</Label>
                      <Select
                        value={englishFormData.terminationNotice}
                        onValueChange={(value) => handleEnglishFormChange('terminationNotice', value)}
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
                        value={englishFormData.dismissalPeriod}
                        onValueChange={(value) => handleEnglishFormChange('dismissalPeriod', value)}
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
                        value={englishFormData.professionalFee}
                        onChange={(e) => handleEnglishFormChange('professionalFee', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="preProFee">Pre-Professional Division ($)</Label>
                      <Input
                        id="preProFee"
                        type="number"
                        value={englishFormData.preProFee}
                        onChange={(e) => handleEnglishFormChange('preProFee', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="supplementalFee">Supplemental Division ($)</Label>
                      <Input
                        id="supplementalFee"
                        type="number"
                        value={englishFormData.supplementalFee}
                        onChange={(e) => handleEnglishFormChange('supplementalFee', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="paymentDueDate">Payment Due Date</Label>
                      <Select
                        value={englishFormData.paymentDueDate}
                        onValueChange={(value) => handleEnglishFormChange('paymentDueDate', value)}
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
                        value={englishFormData.invoiceSendDate}
                        onValueChange={(value) => handleEnglishFormChange('invoiceSendDate', value)}
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
                        value={englishFormData.lateFee}
                        onChange={(e) => handleEnglishFormChange('lateFee', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lateGracePeriod">Late Fee Grace Period (Days)</Label>
                      <Select
                        value={englishFormData.lateGracePeriod}
                        onValueChange={(value) => handleEnglishFormChange('lateGracePeriod', value)}
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
                        value={englishFormData.attendancePolicy}
                        onChange={(e) => handleEnglishFormChange('attendancePolicy', e.target.value)}
                        className="min-h-[80px]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="injuryPolicy">Injury Policy</Label>
                      <Textarea
                        id="injuryPolicy"
                        value={englishFormData.injuryPolicy}
                        onChange={(e) => handleEnglishFormChange('injuryPolicy', e.target.value)}
                        className="min-h-[80px]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="conductPolicy">Student Conduct Policy</Label>
                      <Textarea
                        id="conductPolicy"
                        value={englishFormData.conductPolicy}
                        onChange={(e) => handleEnglishFormChange('conductPolicy', e.target.value)}
                        className="min-h-[80px]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="studioContact">Studio Contact Information</Label>
                  <Input
                    id="studioContact"
                    value={englishFormData.studioContact}
                    onChange={(e) => handleEnglishFormChange('studioContact', e.target.value)}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="edit">
                <Textarea
                  value={formData.html_content}
                  onChange={(e) => setFormData({ ...formData, html_content: e.target.value })}
                  className="min-h-[400px] font-mono text-sm"
                />
              </TabsContent>
              <TabsContent value="preview">
                <div 
                  className="border rounded-lg p-4 max-h-96 overflow-y-auto"
                  dangerouslySetInnerHTML={{ __html: formData.html_content }}
                />
              </TabsContent>
            </Tabs>
            
            <div className="flex gap-2">
              <Button onClick={handleUpdateTemplate} disabled={loading}>
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setIsEditMode(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};