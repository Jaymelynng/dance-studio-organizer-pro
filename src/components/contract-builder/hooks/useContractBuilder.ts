import { useState } from 'react';
import { DropResult } from '@hello-pangea/dnd';
import { ContractElement, ContractBuilderComponent } from '../types';

export const useContractBuilder = () => {
  const [elements, setElements] = useState<ContractElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  const getDefaultContent = (type: string) => {
    switch (type) {
      case 'header': return 'Header Text';
      case 'text': return '<p>Enter your text here...</p>';
      case 'section': return '<p>Enter your policy content here...</p>';
      default: return '';
    }
  };

  const getDefaultStyles = (type: string) => {
    const baseStyles = {
      marginBottom: '25px'
    };

    switch (type) {
      case 'header':
        return {
          ...baseStyles,
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#2c3e50',
          textAlign: 'left'
        };
      case 'text':
        return {
          ...baseStyles,
          fontSize: '16px',
          lineHeight: '1.6',
          color: '#2c3e50'
        };
      case 'student-info':
      case 'parent-info':
      case 'tuition-table':
        return {
          ...baseStyles
        };
      case 'signature':
        return {
          marginTop: '40px',
          borderTop: '1px solid #bdc3c7',
          paddingTop: '20px'
        };
      default:
        return baseStyles;
    }
  };

  const getDefaultSettings = (type: string) => {
    switch (type) {
      case 'section':
        return { title: 'New Policy Section' };
      default:
        return {};
    }
  };

  const onDragEnd = (result: DropResult, components: ContractBuilderComponent[]) => {
    if (!result.destination) return;

    const { source, destination } = result;
    
    // Check if dragging from sidebar to canvas
    if (source.droppableId.startsWith('sidebar-') && destination.droppableId === 'contract-canvas') {
      const componentType = components.find(c => c.id === result.draggableId);
      if (!componentType) return;

      const newElement: ContractElement = {
        id: `element-${Date.now()}`,
        type: componentType.id as any,
        content: getDefaultContent(componentType.id),
        styles: getDefaultStyles(componentType.id),
        settings: getDefaultSettings(componentType.id)
      };

      const newElements = [...elements];
      newElements.splice(destination.index, 0, newElement);
      setElements(newElements);
    } 
    // Reordering within canvas
    else if (source.droppableId === 'contract-canvas' && destination.droppableId === 'contract-canvas') {
      const newElements = Array.from(elements);
      const [reorderedItem] = newElements.splice(source.index, 1);
      newElements.splice(destination.index, 0, reorderedItem);
      setElements(newElements);
    }
  };

  const updateElement = (id: string, updates: Partial<ContractElement>) => {
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

  const clearAll = () => {
    setElements([]);
    setSelectedElement(null);
  };

  return {
    elements,
    setElements,
    selectedElement,
    setSelectedElement,
    onDragEnd,
    updateElement,
    deleteElement,
    duplicateElement,
    clearAll
  };
};