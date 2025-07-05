import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye } from 'lucide-react';
import { EnglishEditor, EnglishFormData } from './EnglishEditor';
import { HtmlEditor } from './HtmlEditor';
import { TemplatePreview } from './TemplatePreview';

interface EditorTabsProps {
  englishFormData: EnglishFormData;
  htmlContent: string;
  onEnglishFormChange: (field: keyof EnglishFormData, value: any) => void;
  onHtmlChange: (content: string) => void;
}

export const EditorTabs = ({ 
  englishFormData, 
  htmlContent, 
  onEnglishFormChange, 
  onHtmlChange 
}: EditorTabsProps) => {
  return (
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
            onChange={onEnglishFormChange} 
          />
        </TabsContent>
        
        <TabsContent value="html" className="p-6 min-h-[600px]">
          <HtmlEditor 
            htmlContent={htmlContent} 
            onChange={onHtmlChange} 
          />
        </TabsContent>
        
        <TabsContent value="preview" className="p-6 min-h-[600px]">
          <TemplatePreview htmlContent={htmlContent} />
        </TabsContent>
      </Tabs>
    </div>
  );
};