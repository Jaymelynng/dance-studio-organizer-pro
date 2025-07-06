import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContractTemplates } from '@/hooks/useContractTemplates';
import { CreateTemplateDialog } from './contract-templates/CreateTemplateDialog';
import { TemplateCard } from './contract-templates/TemplateCard';
import { EnglishFormData } from './contract-templates/EnglishEditor';

export const ContractTemplatesPage = () => {
  const { templates, loading, createTemplate, deleteTemplate } = useContractTemplates();
  const navigate = useNavigate();

  const handleCreateTemplate = async (templateData: {
    name: string;
    division: string;
    season: string;
    html_content: string;
    is_active: boolean;
  }) => {
    await createTemplate(templateData);
  };

  const startEdit = (template: any) => {
    // Navigate to the full-page editor with live preview
    navigate(`/contracts/edit/${template.id}`);
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

    </div>
  );
};