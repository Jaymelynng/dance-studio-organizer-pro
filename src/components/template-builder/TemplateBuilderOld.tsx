import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DragDropContext, 
  Droppable, 
  Draggable,
  DropResult 
} from '@hello-pangea/dnd';
import { 
  Type, 
  Image, 
  Layout, 
  Palette,
  Eye,
  Save,
  Download,
  Mail,
  FileText,
  Plus,
  Settings,
  Move,
  Trash2,
  Copy
} from 'lucide-react';
import { TemplateComponents } from './TemplateComponents';
import { TemplatePreview } from './TemplatePreview';
import { TemplateStyles } from './TemplateStyles';
import { TemplateLibrary } from './TemplateLibrary';

export interface TemplateElement {
  id: string;
  type: 'text' | 'image' | 'container' | 'button' | 'divider' | 'logo' | 'signature';
  content?: string;
  styles?: Record<string, any>;
  children?: TemplateElement[];
  settings?: Record<string, any>;
}

interface TemplateBuilderProps {
  templateType: 'email' | 'document';
  onSave: (template: { name: string; content: TemplateElement[]; html: string }) => void;
}

export const TemplateBuilder = ({ templateType, onSave }: TemplateBuilderProps) => {
  const [elements, setElements] = useState<TemplateElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [templateName, setTemplateName] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const dragId = useRef<string>('');

  const componentTypes = [
    { id: 'text', label: 'Text Block', icon: Type, category: 'content' },
    { id: 'image', label: 'Image', icon: Image, category: 'media' },
    { id: 'container', label: 'Container', icon: Layout, category: 'layout' },
    { id: 'button', label: 'Button', icon: Plus, category: 'interactive' },
    { id: 'divider', label: 'Divider', icon: Settings, category: 'layout' },
    { id: 'logo', label: 'Studio Logo', icon: Image, category: 'branding' },
    { id: 'signature', label: 'Signature', icon: FileText, category: 'branding' }
  ];

  const presetTemplates = {
    email: [
      {
        name: 'Welcome Message',
        description: 'Elegant welcome for new families',
        category: 'general',
        elements: [
          {
            id: '1',
            type: 'logo' as const,
            settings: { alignment: 'center', size: 'medium' }
          },
          {
            id: '2',
            type: 'text' as const,
            content: 'Welcome to Degagé Classical',
            styles: { 
              fontSize: '32px', 
              fontFamily: 'Playfair Display',
              color: 'var(--primary)',
              textAlign: 'center',
              marginBottom: '24px'
            }
          },
          {
            id: '3',
            type: 'text' as const,
            content: 'We are delighted to welcome {{student_name}} to our classical ballet family...',
            styles: { 
              fontSize: '16px',
              lineHeight: '1.6',
              color: 'var(--foreground)',
              marginBottom: '32px'
            }
          }
        ]
      },
      {
        name: 'Competition Announcement',
        description: 'Professional competition details',
        category: 'announcement',
        elements: [
          {
            id: '1',
            type: 'container' as const,
            styles: { 
              background: 'linear-gradient(135deg, var(--primary), var(--primary-glow))',
              padding: '32px',
              borderRadius: '12px',
              color: 'white'
            },
            children: [
              {
                id: '2',
                type: 'text' as const,
                content: 'Competition Season 2024',
                styles: { fontSize: '28px', fontWeight: 'bold', textAlign: 'center' }
              },
              {
                id: '3',
                type: 'text' as const,
                content: 'Registration Details & Schedule',
                styles: { fontSize: '16px', textAlign: 'center', opacity: '0.9' }
              }
            ]
          }
        ]
      },
      {
        name: 'Progress Update',
        description: 'Individual student progress',
        category: 'progress',
        elements: [
          {
            id: '1',
            type: 'text' as const,
            content: '{{student_name}}\'s Progress Report',
            styles: { 
              fontSize: '24px', 
              fontWeight: 'bold',
              color: 'var(--primary)',
              marginBottom: '16px'
            }
          },
          {
            id: '2',
            type: 'container' as const,
            styles: { 
              border: '2px solid var(--border)',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '20px'
            },
            children: [
              {
                id: '3',
                type: 'text' as const,
                content: 'Technical Progress',
                styles: { fontSize: '18px', fontWeight: '600', marginBottom: '8px' }
              },
              {
                id: '4',
                type: 'text' as const,
                content: '{{progress_notes}}',
                styles: { fontSize: '14px', lineHeight: '1.5' }
              }
            ]
          }
        ]
      }
    ]
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    
    if (source.droppableId === 'components' && destination.droppableId === 'canvas') {
      // Adding new component
      const componentType = componentTypes.find(c => c.id === dragId.current);
      if (!componentType) return;

      const newElement: TemplateElement = {
        id: `element-${Date.now()}`,
        type: componentType.id as any,
        content: getDefaultContent(componentType.id),
        styles: getDefaultStyles(componentType.id),
        settings: {},
        ...(componentType.id === 'container' && { children: [] })
      };

      const newElements = [...elements];
      newElements.splice(destination.index, 0, newElement);
      setElements(newElements);
    } else if (source.droppableId === 'canvas' && destination.droppableId === 'canvas') {
      // Reordering elements
      const newElements = Array.from(elements);
      const [reorderedItem] = newElements.splice(source.index, 1);
      newElements.splice(destination.index, 0, reorderedItem);
      setElements(newElements);
    }
  };

  const getDefaultContent = (type: string) => {
    switch (type) {
      case 'text': return 'Your elegant message here...';
      case 'button': return 'Learn More';
      case 'signature': return 'With grace,\nCody\nDegagé Classical Conservatory';
      default: return '';
    }
  };

  const getDefaultStyles = (type: string) => {
    const baseStyles = {
      marginBottom: '16px'
    };

    switch (type) {
      case 'text':
        return {
          ...baseStyles,
          fontSize: '16px',
          lineHeight: '1.6',
          color: 'var(--foreground)',
          fontFamily: 'inherit'
        };
      case 'container':
        return {
          ...baseStyles,
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid var(--border)',
          backgroundColor: 'var(--card)'
        };
      case 'button':
        return {
          ...baseStyles,
          padding: '12px 24px',
          backgroundColor: 'var(--primary)',
          color: 'white',
          borderRadius: '6px',
          textAlign: 'center',
          display: 'inline-block',
          textDecoration: 'none'
        };
      case 'divider':
        return {
          ...baseStyles,
          height: '1px',
          backgroundColor: 'var(--border)',
          width: '100%'
        };
      default:
        return baseStyles;
    }
  };

  const updateElement = (id: string, updates: Partial<TemplateElement>) => {
    setElements(prev => prev.map(el => 
      el.id === id ? { ...el, ...updates } : el
    ));
  };

  const deleteElement = (id: string) => {
    setElements(prev => prev.filter(el => el.id !== id));
    if (selectedElement === id) setSelectedElement(null);
  };

  const duplicateElement = (id: string) => {
    const element = elements.find(el => el.id === id);
    if (!element) return;

    const newElement = {
      ...element,
      id: `element-${Date.now()}`
    };

    const index = elements.findIndex(el => el.id === id);
    const newElements = [...elements];
    newElements.splice(index + 1, 0, newElement);
    setElements(newElements);
  };

  const generateHTML = () => {
    // This would generate the final HTML from the elements structure
    return elements.map(el => `<div>${el.content || ''}</div>`).join('');
  };

  const handleSave = () => {
    if (!templateName.trim()) return;
    
    onSave({
      name: templateName,
      content: elements,
      html: generateHTML()
    });
  };

  return (
    <div className="h-screen flex bg-background">
      <DragDropContext onDragEnd={onDragEnd}>
        {/* Left Sidebar - Components & Templates */}
        <div className="w-80 bg-card border-r border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <h2 className="text-lg font-semibold mb-2">Template Builder</h2>
            <Badge variant="secondary" className="mb-4">
              {templateType === 'email' ? 'Email Template' : 'Document Template'}
            </Badge>
            
            <div className="flex gap-2 mb-4">
              <Button
                variant={previewMode ? "outline" : "default"}
                onClick={() => setPreviewMode(false)}
                size="sm"
                className="flex-1"
              >
                <Settings className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                variant={previewMode ? "default" : "outline"}
                onClick={() => setPreviewMode(true)}
                size="sm"
                className="flex-1"
              >
                <Eye className="h-4 w-4 mr-1" />
                Preview
              </Button>
            </div>
          </div>

          <Tabs defaultValue="components" className="flex-1 flex flex-col">
            <TabsList className="mx-4 mt-2">
              <TabsTrigger value="components" className="flex-1">Components</TabsTrigger>
              <TabsTrigger value="templates" className="flex-1">Library</TabsTrigger>
            </TabsList>

            <TabsContent value="components" className="flex-1 overflow-auto p-4">
              <TemplateComponents 
                components={componentTypes}
              />
            </TabsContent>

            <TabsContent value="templates" className="flex-1 overflow-auto p-4">
              <TemplateLibrary 
                templates={presetTemplates[templateType] || []}
                onSelectTemplate={(template) => setElements(template.elements)}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 flex flex-col">
          {/* Top Toolbar */}
          <div className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Template Name"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="px-3 py-2 border border-border rounded-md bg-background"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button onClick={handleSave} size="sm" disabled={!templateName.trim()}>
                <Save className="h-4 w-4 mr-2" />
                Save Template
              </Button>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 bg-muted/30 p-6 overflow-auto">
            {previewMode ? (
              <TemplatePreview elements={elements} />
            ) : (
              <div className="max-w-2xl mx-auto">
                <Droppable droppableId="canvas">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-96 bg-white rounded-lg shadow-card p-6 ${
                        snapshot.isDraggingOver ? 'ring-2 ring-primary ring-opacity-50' : ''
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
                        <Draggable key={element.id} draggableId={element.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`group relative ${
                                selectedElement === element.id ? 'ring-2 ring-primary' : ''
                              } ${snapshot.isDragging ? 'opacity-50' : ''}`}
                              onClick={() => setSelectedElement(element.id)}
                            >
                              {/* Element Controls */}
                              <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  className="h-6 w-6 p-0"
                                  {...provided.dragHandleProps}
                                >
                                  <Move className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  className="h-6 w-6 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    duplicateElement(element.id);
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
                                    deleteElement(element.id);
                                  }}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>

                              {/* Render Element */}
                              <div style={element.styles}>
                                {element.type === 'text' && (
                                  <div dangerouslySetInnerHTML={{ __html: element.content || '' }} />
                                )}
                                {element.type === 'image' && (
                                  <img 
                                    src={element.content || '/placeholder.svg'} 
                                    alt="Template content" 
                                    className="max-w-full h-auto"
                                  />
                                )}
                                {element.type === 'button' && (
                                  <button style={element.styles}>
                                    {element.content}
                                  </button>
                                )}
                                {element.type === 'divider' && (
                                  <hr style={element.styles} />
                                )}
                                {element.type === 'logo' && (
                                  <div className="flex justify-center">
                                    <div className="text-center">
                                      <div className="text-2xl font-bold text-primary mb-2">DEGAGÉ</div>
                                      <div className="text-sm text-muted-foreground">Classical Ballet</div>
                                    </div>
                                  </div>
                                )}
                                {element.type === 'signature' && (
                                  <div style={{ ...element.styles, whiteSpace: 'pre-line' }}>
                                    {element.content}
                                  </div>
                                )}
                                {element.type === 'container' && (
                                  <div style={{ minHeight: '60px' }}>
                                    {element.children?.map(child => (
                                      <div key={child.id} style={child.styles}>
                                        {child.content}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Properties */}
        {selectedElement && !previewMode && (
          <div className="w-80 bg-card border-l border-border">
            <TemplateStyles
              element={elements.find(el => el.id === selectedElement)!}
              onUpdate={(updates) => updateElement(selectedElement, updates)}
            />
          </div>
        )}
      </DragDropContext>
    </div>
  );
};