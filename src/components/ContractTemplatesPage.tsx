import { useState } from 'react';
import { useContractTemplates } from '@/hooks/useContractTemplates';
import { CreateTemplateDialog } from './contract-templates/CreateTemplateDialog';
import { EditTemplateDialog } from './contract-templates/EditTemplateDialog';
import { TemplateCard } from './contract-templates/TemplateCard';
import { EnglishFormData } from './contract-templates/EnglishEditor';
import { generateHtmlFromEnglish, parseHtmlToEnglish } from './contract-templates/utils';

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

  const handleCreateTemplate = async (templateData: {
    name: string;
    division: string;
    season: string;
    html_content: string;
    is_active: boolean;
  }) => {
    await createTemplate(templateData);
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

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Contract Templates</h1>
          <p className="text-muted-foreground">Manage contract templates for different divisions and seasons</p>
        </div>
        
        <CreateTemplateDialog onCreate={handleCreateTemplate} loading={loading} />
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="text-muted-foreground">Loading templates...</div>
        </div>
      ) : (
        <div className="grid gap-6">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onEdit={startEdit}
              onDelete={deleteTemplate}
            />
          ))}
        </div>
      )}

      <EditTemplateDialog
        isOpen={isEditMode}
        onOpenChange={setIsEditMode}
        selectedTemplate={selectedTemplate}
        formData={formData}
        englishFormData={englishFormData}
        onFormDataChange={handleFormDataChange}
        onEnglishFormChange={handleEnglishFormChange}
        onSave={handleUpdateTemplate}
        loading={loading}
      />
    </div>
  );
};