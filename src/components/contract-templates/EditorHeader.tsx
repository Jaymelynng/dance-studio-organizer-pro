import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';

interface EditorHeaderProps {
  templateName: string;
  onBack: () => void;
  onSave: () => void;
  saving: boolean;
}

export const EditorHeader = ({ templateName, onBack, onSave, saving }: EditorHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Templates
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Contract Template</h1>
          <p className="text-muted-foreground">Full-screen editor for {templateName}</p>
        </div>
      </div>
      
      <Button onClick={onSave} disabled={saving} className="flex items-center gap-2">
        <Save className="h-4 w-4" />
        {saving ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  );
};