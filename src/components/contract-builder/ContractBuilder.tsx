import { useState, useRef } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { ContractSidebar } from './ContractSidebar';
import { ContractCanvas } from './ContractCanvas';
import { ContractToolbar } from './ContractToolbar';
import { ContractStylePanel } from './ContractStylePanel';
import { useContractBuilder } from './hooks/useContractBuilder';
import { contractComponents, defaultContractElements } from './constants';
import { parseHtmlToEnglish, generateHtmlFromEnglish } from '../contract-templates/utils';
import { EnglishFormData } from '../contract-templates/EnglishEditor';

interface ContractBuilderProps {
  templateId?: string;
  initialHtml?: string;
  initialFormData?: EnglishFormData;
  onSave: (data: { elements: any[]; html: string; formData: any }) => void;
}

export const ContractBuilder = ({ 
  templateId, 
  initialHtml, 
  initialFormData,
  onSave 
}: ContractBuilderProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const {
    elements,
    setElements,
    selectedElement,
    setSelectedElement,
    onDragEnd: builderDragEnd,
    updateElement,
    deleteElement,
    duplicateElement,
    clearAll
  } = useContractBuilder();

  const [showStylePanel, setShowStylePanel] = useState(false);

  const handleDragEnd = (result: DropResult) => {
    builderDragEnd(result, contractComponents);
  };

  const handleLoadTemplate = () => {
    if (initialHtml && initialFormData) {
      // Convert existing contract to builder elements
      const parsedData = parseHtmlToEnglish(initialHtml);
      
      // Start with default structure and add custom sections
      const elements = [...defaultContractElements];
      
      // Add custom sections from the existing contract
      if (initialFormData.contractSections) {
        initialFormData.contractSections.forEach((section, index) => {
          elements.push({
            id: `section-${Date.now()}-${index}`,
            type: 'section',
            content: section.content,
            settings: { title: section.title },
            styles: { marginBottom: '25px' }
          });
        });
      }
      
      setElements(elements);
    } else {
      // Load default template
      setElements([...defaultContractElements]);
    }
  };

  const handleSave = () => {
    // Convert elements back to HTML and form data
    const baseFormData: EnglishFormData = initialFormData || {
      companyName: 'Degagé Classical Ballet',
      season: '2025/2026',
      seasonStartDate: '',
      seasonEndDate: '',
      terminationNotice: '30',
      dismissalPeriod: '30',
      professionalFee: '1800',
      preProFee: '1400',
      supplementalFee: '390',
      paymentDueDate: '1st',
      invoiceSendDate: '25th',
      lateFee: '35',
      lateGracePeriod: '3',
      directorEmail: 'cody@degageclassical.com',
      studioContact: 'Degagé Classical Ballet',
      contractSections: []
    };
    
    // Extract sections from elements
    const sections = elements
      .filter(el => el.type === 'section')
      .map((el, index) => ({
        id: el.id,
        title: el.settings?.title || 'Section',
        content: el.content || '',
        type: 'custom' as const,
        order: index
      }));
    
    const updatedFormData = {
      ...baseFormData,
      contractSections: sections
    };
    
    const html = generateHtmlFromEnglish(updatedFormData);
    
    onSave({
      elements,
      html,
      formData: updatedFormData
    });
  };

  const handleScrollToTop = () => {
    canvasRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleScrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="h-screen flex bg-background">
      <DragDropContext onDragEnd={handleDragEnd}>
        <ContractSidebar
          onLoadTemplate={handleLoadTemplate}
          onClearAll={clearAll}
          elementsCount={elements.length}
        />

        <div className="flex-1 flex flex-col">
          <ContractToolbar
            onSave={handleSave}
            onToggleStylePanel={() => setShowStylePanel(!showStylePanel)}
            showStylePanel={showStylePanel}
            elementsCount={elements.length}
          />

          <div ref={canvasRef} className="flex-1 bg-muted/30 p-6 overflow-auto">
            <ContractCanvas
              elements={elements}
              selectedElement={selectedElement}
              onSelectElement={setSelectedElement}
              onDuplicateElement={duplicateElement}
              onDeleteElement={deleteElement}
              onScrollToTop={handleScrollToTop}
              onScrollToSection={handleScrollToSection}
            />
          </div>
        </div>

        {selectedElement && showStylePanel && (
          <ContractStylePanel
            element={elements.find(el => el.id === selectedElement)!}
            onUpdate={(updates) => updateElement(selectedElement, updates)}
            onClose={() => setShowStylePanel(false)}
          />
        )}
      </DragDropContext>
    </div>
  );
};