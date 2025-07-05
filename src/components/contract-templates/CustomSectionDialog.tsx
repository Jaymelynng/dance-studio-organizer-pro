import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RichTextEditor } from './RichTextEditor';
import { Plus } from 'lucide-react';
import { ContractSectionData } from './ContractSection';

interface CustomSectionDialogProps {
  onAddSection: (section: ContractSectionData) => void;
  sectionsLength: number;
}

export const CustomSectionDialog = ({ onAddSection, sectionsLength }: CustomSectionDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('<p>Enter your custom content here...</p>');

  const handleSave = () => {
    if (!title.trim()) return;

    const newSection: ContractSectionData = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      content: content,
      type: 'custom',
      order: sectionsLength,
    };

    onAddSection(newSection);
    
    // Reset form
    setTitle('');
    setContent('<p>Enter your custom content here...</p>');
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTitle('');
    setContent('<p>Enter your custom content here...</p>');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Custom Section
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Custom Section</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="section-title">Section Title</Label>
            <Input
              id="section-title"
              placeholder="e.g., Social Media Policy, Transportation Rules, etc."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div>
            <Label>Section Content</Label>
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="Write your custom section content here..."
              className="mt-2"
            />
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!title.trim()}>
              Add Section
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};