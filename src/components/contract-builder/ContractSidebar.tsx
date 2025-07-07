import { Draggable, Droppable } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { contractComponents, contractCategories } from './constants';
import { ContractBuilderComponent } from './types';
import { cn } from '@/lib/utils';

interface ContractSidebarProps {
  onLoadTemplate: () => void;
  onClearAll: () => void;
  elementsCount: number;
}

const ComponentCard = ({ component, index }: { component: ContractBuilderComponent; index: number }) => (
  <Draggable draggableId={component.id} index={index}>
    {(provided, snapshot) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className={cn(
          "p-3 bg-card border rounded-lg cursor-grab transition-all duration-200 hover:shadow-md hover:scale-105",
          snapshot.isDragging && "opacity-75 rotate-2 scale-110 shadow-xl"
        )}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <component.icon className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm">{component.label}</div>
            <div className="text-xs text-muted-foreground line-clamp-2">
              {component.description}
            </div>
          </div>
        </div>
      </div>
    )}
  </Draggable>
);

export const ContractSidebar = ({ 
  onLoadTemplate, 
  onClearAll, 
  elementsCount 
}: ContractSidebarProps) => {
  return (
    <div className="w-80 bg-background border-r border-border h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Contract Builder</h2>
        <p className="text-sm text-muted-foreground">
          Drag components to build your contract
        </p>
      </div>

      <div className="flex-1 overflow-auto">
        <Tabs defaultValue="components" className="w-full">
          <TabsList className="grid w-full grid-cols-2 m-2">
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="template">Template</TabsTrigger>
          </TabsList>
          
          <TabsContent value="components" className="p-4 space-y-4">
            {contractCategories.map((category) => {
              const categoryComponents = contractComponents.filter(
                comp => comp.category === category.id
              );
              
              return (
                <Card key={category.id}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center justify-between">
                      {category.label}
                      <Badge variant="secondary" className="text-xs">
                        {categoryComponents.length}
                      </Badge>
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {category.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <Droppable droppableId={`sidebar-${category.id}`} isDropDisabled>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="space-y-2"
                        >
                          {categoryComponents.map((component, index) => (
                            <ComponentCard 
                              key={component.id} 
                              component={component} 
                              index={index} 
                            />
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
          
          <TabsContent value="template" className="p-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Quick Start</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Load the existing contract template or start fresh
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={onLoadTemplate}
                  className="w-full"
                  variant="outline"
                >
                  Load Existing Contract
                </Button>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="text-xs font-medium">Current Document</div>
                  <div className="text-xs text-muted-foreground">
                    {elementsCount} elements
                  </div>
                  <Button 
                    onClick={onClearAll}
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    disabled={elementsCount === 0}
                  >
                    Clear All
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Tips</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-2">
                <div>• Drag components from the left panel</div>
                <div>• Click elements to select and style them</div>
                <div>• Use navigation buttons to jump to sections</div>
                <div>• Student data will auto-populate when contracts are generated</div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};