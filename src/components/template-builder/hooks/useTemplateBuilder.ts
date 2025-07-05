import { useState, useRef } from 'react';
import { DropResult } from '@hello-pangea/dnd';
import { TemplateElement } from '../types';

interface UseTemplateBuilderProps {
  templateType: 'email' | 'document';
  onSave: (template: { name: string; content: TemplateElement[]; html: string }) => void;
}

export const useTemplateBuilder = ({ templateType, onSave }: UseTemplateBuilderProps) => {
  const [elements, setElements] = useState<TemplateElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [templateName, setTemplateName] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const dragId = useRef<string>('');

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

  const onDragEnd = (result: DropResult, componentTypes: any[]) => {
    console.log('Drag end result:', result);
    console.log('Draggable ID from result:', result.draggableId);
    
    if (!result.destination) {
      console.log('No destination, drag cancelled');
      return;
    }

    const { source, destination } = result;
    
    // Check if dragging from sidebar to canvas
    if (source.droppableId === 'sidebar' && destination.droppableId === 'canvas') {
      // Use result.draggableId directly instead of dragId.current
      const componentType = componentTypes.find(c => c.id === result.draggableId);
      console.log('Found component type:', componentType);
      
      if (!componentType) {
        console.log('Component type not found for ID:', result.draggableId);
        return;
      }

      const newElement: TemplateElement = {
        id: `element-${Date.now()}`,
        type: componentType.id as any,
        content: getDefaultContent(componentType.id),
        styles: getDefaultStyles(componentType.id),
        settings: {},
        ...(componentType.id === 'container' && { children: [] })
      };

      console.log('Creating new element:', newElement);

      const newElements = [...elements];
      newElements.splice(destination.index, 0, newElement);
      setElements(newElements);
    } else if (source.droppableId === 'canvas' && destination.droppableId === 'canvas') {
      // Reordering within canvas
      const newElements = Array.from(elements);
      const [reorderedItem] = newElements.splice(source.index, 1);
      newElements.splice(destination.index, 0, reorderedItem);
      setElements(newElements);
    } else if (source.droppableId === 'sidebar' && destination.droppableId.startsWith('container-')) {
      // Dragging from sidebar to container
      const containerId = destination.droppableId.replace('container-', '');
      const componentType = componentTypes.find(c => c.id === result.draggableId);
      
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
      const containerIndex = newElements.findIndex(el => el.id === containerId);
      
      if (containerIndex !== -1) {
        const container = { ...newElements[containerIndex] };
        if (!container.children) container.children = [];
        container.children.splice(destination.index, 0, newElement);
        newElements[containerIndex] = container;
        setElements(newElements);
      }
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

  return {
    elements,
    setElements,
    selectedElement,
    setSelectedElement,
    templateName,
    setTemplateName,
    previewMode,
    setPreviewMode,
    dragId,
    onDragEnd,
    updateElement,
    deleteElement,
    duplicateElement,
    handleSave
  };
};