import { DragDropContext } from '@hello-pangea/dnd';
import { TemplatePreview } from './TemplatePreview';
import { TemplateStyles } from './TemplateStyles';
import { TemplateToolbar } from './components/TemplateToolbar';
import { TemplateCanvas } from './components/TemplateCanvas';
import { TemplateSidebar } from './components/TemplateSidebar';
import { useTemplateBuilder } from './hooks/useTemplateBuilder';
import { componentTypes, presetTemplates } from './constants';
import { TemplateElement } from './types';

interface TemplateBuilderProps {
  templateType: 'email' | 'document';
  onSave: (template: { name: string; content: TemplateElement[]; html: string }) => void;
}

export const TemplateBuilder = ({ templateType, onSave }: TemplateBuilderProps) => {
  const {
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
  } = useTemplateBuilder({ templateType, onSave });

  const handleDragEnd = (result: any) => {
    onDragEnd(result, componentTypes);
  };

  const handleSelectTemplate = (template: any) => {
    setElements(template.elements);
  };

  return (
    <div className="h-screen flex bg-background">
      <DragDropContext onDragEnd={handleDragEnd}>
        <TemplateSidebar
          templateType={templateType}
          previewMode={previewMode}
          setPreviewMode={setPreviewMode}
          components={componentTypes}
          templates={presetTemplates[templateType] || []}
          onDragStart={(id) => dragId.current = id}
          onSelectTemplate={handleSelectTemplate}
        />

        <div className="flex-1 flex flex-col">
          <TemplateToolbar
            templateName={templateName}
            setTemplateName={setTemplateName}
            onSave={handleSave}
          />

          <div className="flex-1 bg-muted/30 p-6 overflow-auto">
            {previewMode ? (
              <TemplatePreview elements={elements} />
            ) : (
              <TemplateCanvas
                elements={elements}
                selectedElement={selectedElement}
                onSelectElement={setSelectedElement}
                onDuplicateElement={duplicateElement}
                onDeleteElement={deleteElement}
              />
            )}
          </div>
        </div>

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