import { useState } from 'react';
import { RichTextEditor } from './RichTextEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Trash2, GripVertical, Edit2, Check, X, Copy } from 'lucide-react';
import { Draggable } from '@hello-pangea/dnd';

export interface ContractSectionData {
  id: string;
  title: string;
  content: string;
  type: 'paragraph' | 'policy' | 'terms' | 'custom' | 'emergency' | 'medical';
  order: number;
}

interface ContractSectionProps {
  section: ContractSectionData;
  index: number;
  onUpdate: (section: ContractSectionData) => void;
  onDelete: (id: string) => void;
  onDuplicate?: () => void;
}

export const ContractSection = ({ section, index, onUpdate, onDelete, onDuplicate }: ContractSectionProps) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(section.title);

  const handleTitleSave = () => {
    onUpdate({ ...section, title: tempTitle });
    setIsEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setTempTitle(section.title);
    setIsEditingTitle(false);
  };

  const handleContentChange = (content: string) => {
    onUpdate({ ...section, content });
  };

  return (
    <Draggable draggableId={section.id} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`${snapshot.isDragging ? 'shadow-lg' : ''}`}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div {...provided.dragHandleProps} className="cursor-grab">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </div>
              
              {isEditingTitle ? (
                <div className="flex-1 flex items-center gap-2">
                  <Input
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    className="h-8"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleTitleSave();
                      if (e.key === 'Escape') handleTitleCancel();
                    }}
                    autoFocus
                  />
                  <Button size="sm" variant="ghost" onClick={handleTitleSave}>
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleTitleCancel}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-between">
                  <h4 className="font-semibold">{section.title}</h4>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsEditingTitle(true)}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    {onDuplicate && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={onDuplicate}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDelete(section.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <RichTextEditor
              content={section.content}
              onChange={handleContentChange}
              placeholder={`Enter content for ${section.title}...`}
            />
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
};