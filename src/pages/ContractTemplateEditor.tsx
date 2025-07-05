import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ArrowLeft, Save, Eye, HelpCircle, Info, CheckCircle } from 'lucide-react';
import { EnglishEditor, EnglishFormData } from '@/components/contract-templates/EnglishEditor';
import { HtmlEditor } from '@/components/contract-templates/HtmlEditor';
import { TemplatePreview } from '@/components/contract-templates/TemplatePreview';
import { useContractTemplates } from '@/hooks/useContractTemplates';
import { generateHtmlFromEnglish, parseHtmlToEnglish } from '@/components/contract-templates/utils';
import { useToast } from '@/hooks/use-toast';

const ContractTemplateEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { templates, loading, updateTemplate } = useContractTemplates();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [showHelp, setShowHelp] = useState(true);

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
    directorEmail: 'cody@degageclassical.com',
    studioContact: 'Degagé Classical Ballet',
    contractSections: [
      {
        id: 'attendance-policy',
        title: 'Attendance Policy',
        content: '<p>Students are required to maintain regular attendance for optimal progress.</p>',
        type: 'policy',
        order: 0,
      },
      {
        id: 'injury-policy',
        title: 'Injury Policy',
        content: '<p>Students must inform instructors of any injuries or physical limitations.</p>',
        type: 'policy',
        order: 1,
      },
      {
        id: 'conduct-policy',
        title: 'Student Conduct Policy',
        content: '<p>Students are expected to maintain appropriate behavior and respect for others.</p>',
        type: 'policy',
        order: 2,
      },
    ]
  });

  const template = templates.find(t => t.id === id);

  useEffect(() => {
    if (template) {
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
    }
  }, [template]);

  const handleSave = async () => {
    if (!id || !template) return;
    
    setSaving(true);
    try {
      await updateTemplate(id, formData);
      toast({
        title: "Success",
        description: "Contract template saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save template",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEnglishFormChange = (field: keyof EnglishFormData, value: any) => {
    const updatedEnglishData = { ...englishFormData, [field]: value };
    setEnglishFormData(updatedEnglishData);
    
    // Auto-generate HTML from English form
    const generatedHtml = generateHtmlFromEnglish(updatedEnglishData);
    setFormData(prev => ({ ...prev, html_content: generatedHtml }));
  };

  const handleFormDataChange = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  if (loading || !template) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-muted-foreground">Loading template...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/contracts')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Templates
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Edit Contract Template</h1>
              <p className="text-muted-foreground">Full-screen editor for {template.name}</p>
            </div>
          </div>
          
          <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        {/* Instructions Panel */}
        <Collapsible open={showHelp} onOpenChange={setShowHelp}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full mb-4 justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                Quick Instructions - Click to {showHelp ? 'hide' : 'show'}
              </div>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Alert className="mb-6">
              <Info className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-semibold">How to use this editor:</p>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li><strong>Update basic info</strong> below (template name, season, division)</li>
                    <li><strong>Click "📝 Edit Content"</strong> tab to add/edit sections</li>
                    <li><strong>Add sections:</strong> Choose from dropdown or create custom ones</li>
                    <li><strong>Edit sections:</strong> Click the edit icon on any section title</li>
                    <li><strong>Reorder sections:</strong> Drag and drop using the grip handle (⋮⋮)</li>
                    <li><strong>Preview your work:</strong> Use the "👁 Preview" tab to see the final contract</li>
                    <li><strong>Save changes:</strong> Click "Save Changes" button (top right)</li>
                  </ol>
                </div>
              </AlertDescription>
            </Alert>
          </CollapsibleContent>
        </Collapsible>

        {/* Basic Settings */}
        <div className="bg-card border rounded-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold">Template Settings</h2>
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm text-muted-foreground">Step 1: Update basic information</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="name">Template Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleFormDataChange({ name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="season">Season</Label>
              <Input
                id="season"
                value={formData.season}
                onChange={(e) => handleFormDataChange({ season: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="division">Division</Label>
              <Select
                value={formData.division}
                onValueChange={(value) => handleFormDataChange({ division: value })}
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
          </div>
        </div>

        {/* Main Editor */}
        <div className="bg-card border rounded-lg overflow-hidden">
          <Tabs defaultValue="content" className="w-full">
            <div className="border-b p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Contract Editor</h2>
                <span className="text-sm text-muted-foreground">Step 2: Build your contract content</span>
              </div>
              <TabsList className="grid w-full max-w-lg grid-cols-3">
                <TabsTrigger value="content" className="flex items-center gap-2" title="Add and edit contract sections">
                  📝 Edit Content
                </TabsTrigger>
                <TabsTrigger value="html" className="flex items-center gap-2" title="Advanced: Edit raw HTML">
                  💻 HTML Editor
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex items-center gap-2" title="See how your contract will look">
                  <Eye className="h-4 w-4" />
                  Preview Contract
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="content" className="p-6 min-h-[600px]">
              <EnglishEditor 
                formData={englishFormData} 
                onChange={handleEnglishFormChange} 
              />
            </TabsContent>
            
            <TabsContent value="html" className="p-6 min-h-[600px]">
              <HtmlEditor 
                htmlContent={formData.html_content} 
                onChange={(content) => handleFormDataChange({ html_content: content })} 
              />
            </TabsContent>
            
            <TabsContent value="preview" className="p-6 min-h-[600px]">
              <TemplatePreview htmlContent={formData.html_content} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ContractTemplateEditor;