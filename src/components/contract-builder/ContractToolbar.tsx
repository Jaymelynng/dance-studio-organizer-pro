import { Save, Palette, FileText, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface ContractToolbarProps {
  onSave: () => void;
  onToggleStylePanel: () => void;
  showStylePanel: boolean;
  elementsCount: number;
}

export const ContractToolbar = ({ 
  onSave, 
  onToggleStylePanel, 
  showStylePanel,
  elementsCount 
}: ContractToolbarProps) => {
  return (
    <div className="border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-semibold">Contract Builder</h1>
          </div>
          
          <Separator orientation="vertical" className="h-6" />
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              Live Preview
            </Badge>
            <Badge variant="outline">
              {elementsCount} elements
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleStylePanel}
            className={showStylePanel ? "bg-primary text-primary-foreground" : ""}
          >
            <Palette className="h-4 w-4 mr-2" />
            Styles
          </Button>
          
          <Button onClick={onSave} size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save Contract
          </Button>
        </div>
      </div>
    </div>
  );
};