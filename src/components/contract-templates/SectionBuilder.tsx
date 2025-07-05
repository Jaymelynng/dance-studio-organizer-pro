import { useState } from 'react';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { ContractSection, ContractSectionData } from './ContractSection';
import { CustomSectionDialog } from './CustomSectionDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Copy, Info, GripVertical } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SectionBuilderProps {
  sections: ContractSectionData[];
  onSectionsChange: (sections: ContractSectionData[]) => void;
}

const SECTION_TEMPLATES = [
  { type: 'paragraph', title: 'Introduction Paragraph', content: '<p>Enter your introduction text here...</p>' },
  { type: 'policy', title: 'Attendance Policy', content: '<p>Students are required to maintain regular attendance for optimal progress. Missing more than 3 classes per month may result in dismissal from the program.</p>' },
  { type: 'policy', title: 'Injury Policy', content: '<p>Students must inform instructors of any injuries or physical limitations. Injured students should not participate until cleared by a medical professional.</p>' },
  { type: 'policy', title: 'Student Conduct Policy', content: '<p>Students are expected to maintain appropriate behavior and respect for others. Inappropriate behavior may result in dismissal from the program.</p>' },
  { type: 'policy', title: 'Costume Policy', content: '<p>Students are responsible for all costume costs and fittings. Costumes must be returned in good condition after performances.</p>' },
  { type: 'policy', title: 'Recital Requirements', content: '<p>Participation in the end-of-year recital is required for all students. Additional fees may apply for recital participation.</p>' },
  { type: 'policy', title: 'Makeup & Hair Policy', content: '<p>Students must arrive with proper stage makeup and hair styling for all performances and dress rehearsals.</p>' },
  { type: 'policy', title: 'Dress Code', content: '<p>Students must adhere to the dress code at all times. Proper dance attire and shoes are required for each class.</p>' },
  { type: 'policy', title: 'Competition Team Requirements', content: '<p>Competition team members have additional rehearsal and performance requirements. Extra fees apply for competition participation.</p>' },
  { type: 'policy', title: 'Photo/Video Release', content: '<p>The studio may use photos and videos of students for promotional purposes unless written notice is provided otherwise.</p>' },
  { type: 'terms', title: 'Payment Terms', content: '<p>Tuition is due on the specified date each month. Late fees will be applied after the grace period.</p>' },
  { type: 'terms', title: 'Cancellation Terms', content: '<p>Cancellation requires written notice as specified in the contract. Early termination may result in additional fees.</p>' },
  { type: 'emergency', title: 'Emergency Contact Information', content: '<p>Parents must provide current emergency contact information. The studio will contact emergency contacts if parents cannot be reached.</p>' },
  { type: 'medical', title: 'Medical Information Requirements', content: '<p>Students with medical conditions, allergies, or dietary restrictions must inform the studio in writing.</p>' },
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

  const handleDuplicateSection = (section: ContractSectionData) => {
    const duplicatedSection: ContractSectionData = {
      ...section,
      id: `${section.id}-copy-${Date.now()}`,
      title: `${section.title} (Copy)`,
      order: sections.length,
    };
    onSectionsChange([...sections, duplicatedSection]);
  };

  const handleCustomSectionAdd = (section: ContractSectionData) => {
    onSectionsChange([...sections, section]);
  };

  return (
    <div className="space-y-4">
      {sections.length === 0 && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-semibold">Get started by adding your first section!</p>
              <p className="text-sm">
                Choose from pre-made templates like "Attendance Policy" or "Payment Terms", 
                or create your own custom section below.
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Section to Contract
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Choose from common dance studio policies or create your own custom section
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex gap-2 flex-1">
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Choose a pre-made section template..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="" disabled>Select a template to add...</SelectItem>
                  {SECTION_TEMPLATES.filter(t => t.type !== 'custom').map((template) => (
                    <SelectItem key={template.type + template.title} value={template.type}>
                      {template.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                onClick={handleAddSection} 
                disabled={!selectedTemplate}
                title="Add the selected template section to your contract"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Template
              </Button>
            </div>
            <CustomSectionDialog 
              onAddSection={handleCustomSectionAdd}
              sectionsLength={sections.length}
            />
          </div>
        </CardContent>
      </Card>

      {sections.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GripVertical className="h-4 w-4" />
              Your Contract Sections ({sections.length})
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Drag sections to reorder • Click edit (✏️) to change title • Click copy (📋) to duplicate • Click trash (🗑️) to delete
            </p>
          </CardHeader>
          <CardContent>
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
                        onDuplicate={() => handleDuplicateSection(section)}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </CardContent>
        </Card>
      )}

    </div>
  );
};