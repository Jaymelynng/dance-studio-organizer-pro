import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Eye } from 'lucide-react';
import { TemplateComponents } from '../TemplateComponents';
import { TemplateLibrary } from '../TemplateLibrary';
import { ComponentType, Template } from '../types';

interface TemplateSidebarProps {
  templateType: 'email' | 'document';
  previewMode: boolean;
  setPreviewMode: (mode: boolean) => void;
  components: ComponentType[];
  templates: Template[];
  onSelectTemplate: (template: Template) => void;
}

export const TemplateSidebar = ({ 
  templateType, 
  previewMode, 
  setPreviewMode, 
  components, 
  templates, 
  onSelectTemplate 
}: TemplateSidebarProps) => {
  return (
    <div className="w-80 bg-card border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold mb-2">Template Builder</h2>
        <Badge variant="secondary" className="mb-4">
          {templateType === 'email' ? 'Email Template' : 'Document Template'}
        </Badge>
        
        <div className="flex gap-2 mb-4">
          <Button
            variant={previewMode ? "outline" : "default"}
            onClick={() => setPreviewMode(false)}
            size="sm"
            className="flex-1"
          >
            <Settings className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant={previewMode ? "default" : "outline"}
            onClick={() => setPreviewMode(true)}
            size="sm"
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-1" />
            Preview
          </Button>
        </div>
      </div>

      <Tabs defaultValue="components" className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-2">
          <TabsTrigger value="components" className="flex-1">Components</TabsTrigger>
          <TabsTrigger value="templates" className="flex-1">Library</TabsTrigger>
        </TabsList>

        <TabsContent value="components" className="flex-1 overflow-auto p-4">
          <TemplateComponents 
            components={components}
          />
        </TabsContent>

        <TabsContent value="templates" className="flex-1 overflow-auto p-4">
          <TemplateLibrary 
            templates={templates}
            onSelectTemplate={onSelectTemplate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};