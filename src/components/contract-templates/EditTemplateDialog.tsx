import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnglishEditor, EnglishFormData } from './EnglishEditor';
import { HtmlEditor } from './HtmlEditor';
import { TemplatePreview } from './TemplatePreview';

interface EditTemplateDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTemplate: any;
  formData: {
    name: string;
    division: string;
    season: string;
    html_content: string;
  };
  englishFormData: EnglishFormData;
  onFormDataChange: (data: Partial<{
    name: string;
    division: string;
    season: string;
    html_content: string;
  }>) => void;
  onEnglishFormChange: (field: keyof EnglishFormData, value: string) => void;
  onSave: () => void;
  loading: boolean;
}

export const EditTemplateDialog = ({
  isOpen,
  onOpenChange,
  selectedTemplate,
  formData,
  englishFormData,
  onFormDataChange,
  onEnglishFormChange,
  onSave,
  loading
}: EditTemplateDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
                onChange={(e) => onFormDataChange({ name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-season">Season</Label>
              <Input
                id="edit-season"
                value={formData.season}
                onChange={(e) => onFormDataChange({ season: e.target.value })}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="edit-division">Division</Label>
            <Select
              value={formData.division}
              onValueChange={(value) => onFormDataChange({ division: value })}
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
            
            <TabsContent value="english">
              <EnglishEditor 
                formData={englishFormData} 
                onChange={onEnglishFormChange} 
              />
            </TabsContent>
            
            <TabsContent value="edit">
              <HtmlEditor 
                htmlContent={formData.html_content} 
                onChange={(content) => onFormDataChange({ html_content: content })} 
              />
            </TabsContent>
            
            <TabsContent value="preview">
              <TemplatePreview htmlContent={formData.html_content} />
            </TabsContent>
          </Tabs>
          
          <div className="flex gap-2">
            <Button onClick={onSave} disabled={loading}>
              Save Changes
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};