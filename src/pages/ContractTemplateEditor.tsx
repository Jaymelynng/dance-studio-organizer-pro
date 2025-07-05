import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EnglishFormData } from '@/components/contract-templates/EnglishEditor';
import { EditorHeader } from '@/components/contract-templates/EditorHeader';
import { EditorInstructions } from '@/components/contract-templates/EditorInstructions';
import { BasicSettings } from '@/components/contract-templates/BasicSettings';
import { EditorTabs } from '@/components/contract-templates/EditorTabs';
import { useContractTemplates } from '@/hooks/useContractTemplates';
import { generateHtmlFromEnglish, parseHtmlToEnglish } from '@/components/contract-templates/utils';
import { useToast } from '@/hooks/use-toast';

const ContractTemplateEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { templates, loading, updateTemplate } = useContractTemplates();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

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
        <EditorHeader
          templateName={template.name}
          onBack={() => navigate('/contracts')}
          onSave={handleSave}
          saving={saving}
        />

        <EditorInstructions />

        <BasicSettings
          formData={formData}
          onChange={handleFormDataChange}
        />

        <EditorTabs
          englishFormData={englishFormData}
          htmlContent={formData.html_content}
          onEnglishFormChange={handleEnglishFormChange}
          onHtmlChange={(content) => handleFormDataChange({ html_content: content })}
        />
      </div>
    </div>
  );
};

export default ContractTemplateEditor;