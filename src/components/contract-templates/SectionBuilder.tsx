import { useState } from 'react';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { ContractSection, ContractSectionData } from './ContractSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';

interface SectionBuilderProps {
  sections: ContractSectionData[];
  onSectionsChange: (sections: ContractSectionData[]) => void;
}

const SECTION_TEMPLATES = [
  { type: 'paragraph', title: 'Introduction Paragraph', content: '<p>Enter your introduction text here...</p>' },
  { type: 'policy', title: 'Attendance Policy', content: '<p>Students are required to maintain regular attendance for optimal progress.</p>' },
  { type: 'policy', title: 'Injury Policy', content: '<p>Students must inform instructors of any injuries or physical limitations.</p>' },
  { type: 'policy', title: 'Conduct Policy', content: '<p>Students are expected to maintain appropriate behavior and respect for others.</p>' },
  { type: 'terms', title: 'Payment Terms', content: '<p>Tuition is due on the specified date each month.</p>' },
  { type: 'terms', title: 'Cancellation Terms', content: '<p>Cancellation requires written notice as specified.</p>' },
  { type: 'custom', title: 'Custom Section', content: '<p>Add your custom content here...</p>' },
];

export const SectionBuilder = ({ sections, onSectionsChange }: SectionBuilderProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order numbers
    const reorderedSections = items.map((section, index) => ({
      ...section,
      order: index,
    }));

    onSectionsChange(reorderedSections);
  };

  const handleAddSection = () => {
    if (!selectedTemplate) return;

    const template = SECTION_TEMPLATES.find(t => t.type === selectedTemplate);
    if (!template) return;

    const newSection: ContractSectionData = {
      id: `section-${Date.now()}`,
      title: template.title,
      content: template.content,
      type: template.type as any,
      order: sections.length,
    };

    onSectionsChange([...sections, newSection]);
    setSelectedTemplate('');
  };

  const handleUpdateSection = (updatedSection: ContractSectionData) => {
    const updatedSections = sections.map(section =>
      section.id === updatedSection.id ? updatedSection : section
    );
    onSectionsChange(updatedSections);
  };

  const handleDeleteSection = (sectionId: string) => {
    const filteredSections = sections.filter(section => section.id !== sectionId);
    const reorderedSections = filteredSections.map((section, index) => ({
      ...section,
      order: index,
    }));
    onSectionsChange(reorderedSections);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Add New Section</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Choose a section template..." />
              </SelectTrigger>
              <SelectContent>
                {SECTION_TEMPLATES.map((template) => (
                  <SelectItem key={template.type + template.title} value={template.type}>
                    {template.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAddSection} disabled={!selectedTemplate}>
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </Button>
          </div>
        </CardContent>
      </Card>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sections">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-3"
            >
              {sections.map((section, index) => (
                <ContractSection
                  key={section.id}
                  section={section}
                  index={index}
                  onUpdate={handleUpdateSection}
                  onDelete={handleDeleteSection}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {sections.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-8 text-center text-muted-foreground">
            <p>No sections added yet. Use the section builder above to add content to your contract.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};