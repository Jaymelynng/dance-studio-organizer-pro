import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

interface CreateTemplateDialogProps {
  onCreate: (template: {
    name: string;
    division: string;
    season: string;
    html_content: string;
    is_active: boolean;
  }) => Promise<void>;
  loading: boolean;
}

export const CreateTemplateDialog = ({ onCreate, loading }: CreateTemplateDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    division: 'All',
    season: '2025/2026',
    html_content: ''
  });

  const handleCreate = async () => {
    try {
      await onCreate({
        ...formData,
        is_active: true
      });
      setFormData({ name: '', division: 'All', season: '2025/2026', html_content: '' });
    } catch (error) {
      console.error('Error creating template:', error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Contract Template</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Template Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Parent Contract 2025/2026"
              />
            </div>
            <div>
              <Label htmlFor="season">Season</Label>
              <Input
                id="season"
                value={formData.season}
                onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                placeholder="e.g., 2025/2026"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="division">Division</Label>
            <Select
              value={formData.division}
              onValueChange={(value) => setFormData({ ...formData, division: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Divisions</SelectItem>
                <SelectItem value="Professional">Professional</SelectItem>
                <SelectItem value="Pre-Professional">Pre-Professional</SelectItem>
                <SelectItem value="Supplemental">Supplemental</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="html_content">HTML Content</Label>
            <Textarea
              id="html_content"
              value={formData.html_content}
              onChange={(e) => setFormData({ ...formData, html_content: e.target.value })}
              placeholder="Paste your HTML contract template here..."
              className="min-h-[400px] font-mono text-sm"
            />
          </div>
          
          <Button onClick={handleCreate} disabled={loading}>
            Create Template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};