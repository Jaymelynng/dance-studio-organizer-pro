import { Button } from '@/components/ui/button';
import { Move, Copy, Trash2 } from 'lucide-react';

interface ElementControlsProps {
  onDuplicate: () => void;
  onDelete: () => void;
  dragHandleProps: any;
}

export const ElementControls = ({ onDuplicate, onDelete, dragHandleProps }: ElementControlsProps) => {
  return (
    <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
      <Button
        size="sm"
        variant="secondary"
        className="h-6 w-6 p-0"
        {...dragHandleProps}
      >
        <Move className="h-3 w-3" />
      </Button>
      <Button
        size="sm"
        variant="secondary"
        className="h-6 w-6 p-0"
        onClick={(e) => {
          e.stopPropagation();
          onDuplicate();
        }}
      >
        <Copy className="h-3 w-3" />
      </Button>
      <Button
        size="sm"
        variant="destructive"
        className="h-6 w-6 p-0"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
};