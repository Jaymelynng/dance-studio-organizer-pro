import { Button } from '@/components/ui/button';
import { Move, Copy, Trash2 } from 'lucide-react';

interface ElementControlsProps {
  onDuplicate: () => void;
  onDelete: () => void;
  dragHandleProps: any;
}

export const ElementControls = ({ onDuplicate, onDelete, dragHandleProps }: ElementControlsProps) => {
  return (
    <div className="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 flex gap-1 z-20 bg-card border border-border rounded-lg shadow-elegant p-1.5">
      <Button
        size="sm"
        variant="ghost"
        className="h-7 w-7 p-0 hover:bg-muted cursor-grab active:cursor-grabbing"
        {...dragHandleProps}
        title="Drag to reorder"
      >
        <Move className="h-3.5 w-3.5 text-muted-foreground" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="h-7 w-7 p-0 hover:bg-muted"
        onClick={(e) => {
          e.stopPropagation();
          onDuplicate();
        }}
        title="Duplicate element"
      >
        <Copy className="h-3.5 w-3.5 text-muted-foreground" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="h-7 w-7 p-0 hover:bg-destructive hover:text-destructive-foreground"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        title="Delete element"
      >
        <Trash2 className="h-3.5 w-3.5 text-destructive hover:text-destructive-foreground" />
      </Button>
    </div>
  );
};