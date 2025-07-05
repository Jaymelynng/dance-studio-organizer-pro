import { Draggable, Droppable } from '@hello-pangea/dnd';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

import { ComponentType } from './types';

interface TemplateComponentsProps {
  components: ComponentType[];
  onDragStart: (id: string) => void;
}

export const TemplateComponents = ({ components, onDragStart }: TemplateComponentsProps) => {
  const categories = {
    content: { label: 'Content', color: 'bg-blue-100 text-blue-800' },
    layout: { label: 'Layout', color: 'bg-green-100 text-green-800' },
    media: { label: 'Media', color: 'bg-purple-100 text-purple-800' },
    interactive: { label: 'Interactive', color: 'bg-orange-100 text-orange-800' },
    branding: { label: 'Branding', color: 'bg-pink-100 text-pink-800' }
  };

  const groupedComponents = components.reduce((acc, component) => {
    if (!acc[component.category]) {
      acc[component.category] = [];
    }
    acc[component.category].push(component);
    return acc;
  }, {} as Record<string, ComponentType[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedComponents).map(([category, categoryComponents]) => (
        <div key={category}>
          <div className="flex items-center gap-2 mb-3">
            <Badge className={categories[category as keyof typeof categories]?.color || 'bg-gray-100 text-gray-800'}>
              {categories[category as keyof typeof categories]?.label || category}
            </Badge>
          </div>
          
          <Droppable droppableId="components" isDropDisabled={true}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
                {categoryComponents.map((component, index) => (
                  <Draggable
                    key={component.id}
                    draggableId={component.id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`cursor-grab hover:shadow-md transition-shadow ${
                          snapshot.isDragging ? 'shadow-lg rotate-3' : ''
                        }`}
                        onDragStart={() => onDragStart(component.id)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center gap-3">
                            <component.icon className="h-5 w-5 text-muted-foreground" />
                            <span className="text-sm font-medium">{component.label}</span>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      ))}
    </div>
  );
};