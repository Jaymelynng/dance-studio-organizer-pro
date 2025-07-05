import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Layout } from 'lucide-react';
import { TemplateElement } from '../types';
import { ElementRenderer } from './ElementRenderer';
import { ElementControls } from './ElementControls';
import { ContainerDropZone } from './ContainerDropZone';

interface TemplateCanvasProps {
  elements: TemplateElement[];
  selectedElement: string | null;
  onSelectElement: (id: string) => void;
  onDuplicateElement: (id: string) => void;
  onDeleteElement: (id: string) => void;
}

export const TemplateCanvas = ({ 
  elements, 
  selectedElement, 
  onSelectElement, 
  onDuplicateElement, 
  onDeleteElement 
}: TemplateCanvasProps) => {
  return (
    <div className="max-w-2xl mx-auto">
      <Droppable droppableId="canvas">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`min-h-96 bg-white rounded-lg shadow-card p-6 transition-all ${
              snapshot.isDraggingOver ? 'ring-2 ring-primary ring-opacity-50 bg-primary/5' : ''
            }`}
          >
            {elements.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <Layout className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">Start building your template</p>
                <p className="text-sm">Drag components from the sidebar to get started</p>
              </div>
            )}

            {elements.map((element, index) => (
              <div key={element.id}>
                {/* Drop zone indicator */}
                <div 
                  className={`h-1 mx-4 rounded-full transition-all duration-200 ${
                    snapshot.isDraggingOver ? 'bg-primary/30 opacity-100' : 'opacity-0'
                  }`}
                />
                
                <Draggable draggableId={element.id} index={index}>
                  {(provided, dragSnapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`group relative mb-4 p-2 rounded-lg transition-all duration-200 ${
                        selectedElement === element.id 
                          ? 'ring-2 ring-primary shadow-lg bg-primary/5' 
                          : 'hover:ring-1 hover:ring-border hover:shadow-md'
                      } ${
                        dragSnapshot.isDragging 
                          ? 'opacity-75 rotate-1 scale-105 shadow-xl' 
                          : ''
                      }`}
                      onClick={() => onSelectElement(element.id)}
                    >
                      <ElementControls
                        onDuplicate={() => onDuplicateElement(element.id)}
                        onDelete={() => onDeleteElement(element.id)}
                        dragHandleProps={provided.dragHandleProps}
                      />
                      {element.type === 'container' ? (
                        <ContainerDropZone
                          element={element}
                          onDrop={(droppedElement) => {
                            // This will be handled by the parent component
                            console.log('Dropped into container:', droppedElement);
                          }}
                        />
                      ) : (
                        <ElementRenderer element={element} />
                      )}
                    </div>
                  )}
                </Draggable>
              </div>
            ))}
            
            {/* Final drop zone indicator */}
            <div 
              className={`h-1 mx-4 rounded-full transition-all duration-200 ${
                snapshot.isDraggingOver ? 'bg-primary/30 opacity-100' : 'opacity-0'
              }`}
            />
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};