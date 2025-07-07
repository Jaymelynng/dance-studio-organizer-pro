import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Eye, Columns, X } from 'lucide-react';
import { EnglishEditor, EnglishFormData } from './EnglishEditor';
import { BeautifulFormEditor } from './BeautifulFormEditor';
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
  const [showLivePreview, setShowLivePreview] = useState(false);

  if (showLivePreview) {
    return (
      <div className="bg-card border rounded-lg overflow-hidden">
        <div className="border-b p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Contract Editor - Live Preview Mode</h2>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowLivePreview(false)}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Back to Tabs
            </Button>
          </div>
        </div>
        
        <div className="flex h-[700px]">
          {/* Editor Panel */}
          <div className="flex-1 border-r overflow-hidden">
            <Tabs defaultValue="content" className="h-full flex flex-col">
              <div className="border-b px-4 py-2">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="content" className="text-sm">
                    📝 Edit Content
                  </TabsTrigger>
                  <TabsTrigger value="html" className="text-sm">
                    💻 HTML Editor
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="content" className="flex-1 p-4 overflow-y-auto">
                <BeautifulFormEditor 
                  formData={englishFormData} 
                  onChange={onEnglishFormChange} 
                />
              </TabsContent>
              
              <TabsContent value="html" className="flex-1 p-4 overflow-y-auto">
                <HtmlEditor 
                  htmlContent={htmlContent} 
                  onChange={onHtmlChange} 
                />
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Live Preview Panel */}
          <div className="flex-1 flex flex-col">
            <div className="border-b px-4 py-2">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Live Preview
              </h3>
            </div>
            <div className="flex-1 p-4 overflow-y-auto bg-background">
              <TemplatePreview htmlContent={htmlContent} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-lg overflow-hidden">
      <Tabs defaultValue="content" className="w-full">
        <div className="border-b p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Contract Editor</h2>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowLivePreview(true)}
                className="flex items-center gap-2"
              >
                <Columns className="h-4 w-4" />
                Live Preview Mode
              </Button>
              <span className="text-sm text-muted-foreground">Step 2: Build your contract content</span>
            </div>
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
          <BeautifulFormEditor 
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