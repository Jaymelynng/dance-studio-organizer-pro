import { Copy, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ContractElementControlsProps {
  onDuplicate: () => void;
  onDelete: () => void;
  dragHandleProps?: any;
  isSelected?: boolean;
}

export const ContractElementControls = ({ 
  onDuplicate, 
  onDelete, 
  dragHandleProps,
  isSelected 
}: ContractElementControlsProps) => {
  return (
    <div className={cn(
      "absolute -top-3 -right-3 z-20 flex items-center gap-1 transition-all duration-200",
      isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
    )}>
      <Button
        size="sm"
        variant="secondary"
        className="h-6 w-6 p-0 bg-background border shadow-sm hover:bg-primary hover:text-primary-foreground"
        onClick={(e) => {
          e.stopPropagation();
          onDuplicate();
        }}
        title="Duplicate element"
      >
        <Copy className="h-3 w-3" />
      </Button>
      
      <Button
        size="sm"
        variant="secondary"
        className="h-6 w-6 p-0 bg-background border shadow-sm hover:bg-destructive hover:text-destructive-foreground"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        title="Delete element"
      >
        <Trash2 className="h-3 w-3" />
      </Button>
      
      <Button
        size="sm"
        variant="secondary"
        className="h-6 w-6 p-0 bg-background border shadow-sm cursor-grab active:cursor-grabbing"
        {...dragHandleProps}
        title="Drag to reorder"
      >
        <GripVertical className="h-3 w-3" />
      </Button>
    </div>
  );
};