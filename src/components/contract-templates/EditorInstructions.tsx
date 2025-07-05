import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { HelpCircle, Info } from 'lucide-react';

export const EditorInstructions = () => {
  const [showHelp, setShowHelp] = useState(true);

  return (
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
  );
};