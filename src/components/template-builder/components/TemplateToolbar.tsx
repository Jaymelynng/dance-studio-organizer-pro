import { Button } from '@/components/ui/button';
import { Download, Save } from 'lucide-react';

interface TemplateToolbarProps {
  templateName: string;
  setTemplateName: (name: string) => void;
  onSave: () => void;
}

export const TemplateToolbar = ({ templateName, setTemplateName, onSave }: TemplateToolbarProps) => {
  return (
    <div className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Template Name"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          className="px-3 py-2 border border-border rounded-md bg-background"
        />
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        <Button onClick={onSave} size="sm" disabled={!templateName.trim()}>
          <Save className="h-4 w-4 mr-2" />
          Save Template
        </Button>
      </div>
    </div>
  );
};