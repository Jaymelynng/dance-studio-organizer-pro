import { Droppable } from '@hello-pangea/dnd';
import { TemplateElement } from '../types';
import { ElementRenderer } from './ElementRenderer';

interface ContainerDropZoneProps {
  element: TemplateElement;
  onDrop: (element: TemplateElement) => void;
}

export const ContainerDropZone = ({ element, onDrop }: ContainerDropZoneProps) => {
  return (
    <Droppable droppableId={`container-${element.id}`} type="CONTAINER_ITEM">
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={{
            minHeight: '80px',
            padding: element.styles?.padding || '20px',
            backgroundColor: element.styles?.backgroundColor || element.styles?.background || 'var(--card)',
            border: element.styles?.border || '1px solid var(--border)',
            borderRadius: element.styles?.borderRadius || '8px',
            boxShadow: element.styles?.boxShadow,
            margin: element.styles?.margin,
            marginBottom: element.styles?.marginBottom,
            ...element.styles,
            ...(snapshot.isDraggingOver && {
              backgroundColor: 'var(--primary)/5',
              borderColor: 'var(--primary)',
              borderStyle: 'dashed'
            })
          }}
        >
          {element.children && element.children.length > 0 ? (
            element.children.map((child, index) => (
              <div key={child.id} className="mb-2 last:mb-0">
                <ElementRenderer element={child} />
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground text-sm py-4">
              {snapshot.isDraggingOver 
                ? "Drop element here" 
                : "Drop elements here to create content sections"
              }
            </div>
          )}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};