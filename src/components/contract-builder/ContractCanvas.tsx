import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Eye, ArrowUp, MoreVertical, FileText } from 'lucide-react';
import { ContractElement } from './types';
import { ContractElementRenderer } from './ContractElementRenderer';
import { ContractElementControls } from './ContractElementControls';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ContractCanvasProps {
  elements: ContractElement[];
  selectedElement: string | null;
  onSelectElement: (id: string) => void;
  onDuplicateElement: (id: string) => void;
  onDeleteElement: (id: string) => void;
  onScrollToTop: () => void;
  onScrollToSection: (sectionId: string) => void;
}

export const ContractCanvas = ({ 
  elements, 
  selectedElement, 
  onSelectElement, 
  onDuplicateElement, 
  onDeleteElement,
  onScrollToTop,
  onScrollToSection
}: ContractCanvasProps) => {
  
  // Extract sections for navigation
  const sections = elements.filter(el => 
    el.type === 'header' || el.type === 'section' || el.type === 'student-info' || el.type === 'parent-info' || el.type === 'tuition-table'
  );

  return (
    <div className="flex flex-col h-full">
      {/* Document Navigation */}
      <Card className="mb-4 p-3 bg-card/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onScrollToTop}
              className="flex items-center gap-2"
            >
              <ArrowUp className="h-4 w-4" />
              Top
            </Button>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-1 overflow-x-auto max-w-md">
              {sections.slice(0, 6).map((section) => (
                <Button
                  key={section.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => onScrollToSection(section.id)}
                  className="whitespace-nowrap text-xs"
                  title={section.content || section.type}
                >
                  {section.content?.slice(0, 20) || section.type}
                </Button>
              ))}
              {sections.length > 6 && (
                <Button variant="ghost" size="sm" className="text-xs">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Eye className="h-4 w-4" />
            Live Preview
          </div>
        </div>
      </Card>

      {/* Contract Document Canvas */}
      <div className="flex-1 bg-white rounded-lg shadow-lg mx-auto max-w-4xl overflow-auto">
        <Droppable droppableId="contract-canvas">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={cn(
                "min-h-[800px] p-8 transition-all duration-200",
                snapshot.isDraggingOver && "bg-primary/5 ring-2 ring-primary/20"
              )}
              style={{
                fontFamily: 'Arial, sans-serif',
                lineHeight: '1.6',
                color: '#2c3e50'
              }}
            >
              {elements.length === 0 && (
                <div className="text-center py-32 text-muted-foreground">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center">
                    <FileText className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 text-foreground">Ready to Build?</h3>
                  <p className="text-lg mb-2">Drag elements from the sidebar to start building your contract</p>
                  <div className="bg-muted/50 rounded-lg p-4 mt-6 max-w-md mx-auto">
                    <p className="text-sm font-medium mb-2">💡 Quick Start Tips:</p>
                    <div className="text-sm space-y-1 text-left">
                      <p>• Load existing template from sidebar</p>
                      <p>• Drag & drop components to add content</p>
                      <p>• Click any element to edit it</p>
                    </div>
                  </div>
                </div>
              )}

              {elements.map((element, index) => (
                <div key={element.id} id={element.id}>
                  {/* Drop zone indicator */}
                  {snapshot.isDraggingOver && (
                    <div className="h-2 mx-4 bg-primary/20 rounded-full mb-2 opacity-0 animate-pulse" />
                  )}
                  
                  <Draggable draggableId={element.id} index={index}>
                    {(provided, dragSnapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={cn(
                          "group relative transition-all duration-200 rounded-lg",
                          selectedElement === element.id && "ring-2 ring-primary shadow-lg bg-primary/5",
                          dragSnapshot.isDragging && "opacity-75 rotate-1 scale-105 shadow-xl z-50"
                        )}
                        onClick={() => onSelectElement(element.id)}
                      >
                        <ContractElementControls
                          onDuplicate={() => onDuplicateElement(element.id)}
                          onDelete={() => onDeleteElement(element.id)}
                          dragHandleProps={provided.dragHandleProps}
                          isSelected={selectedElement === element.id}
                        />
                        
                        <div className="relative">
                          <ContractElementRenderer element={element} />
                        </div>
                      </div>
                    )}
                  </Draggable>
                </div>
              ))}
              
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
};