import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileText, Edit, Trash2, Eye } from 'lucide-react';

interface TemplateCardProps {
  template: {
    id: string;
    name: string;
    division: string;
    season: string;
    html_content: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
  onEdit: (template: any) => void;
  onDelete: (id: string) => void;
}

export const TemplateCard = ({ template, onEdit, onDelete }: TemplateCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {template.name}
            </CardTitle>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline">{template.division}</Badge>
              <Badge variant="secondary">{template.season}</Badge>
              <Badge variant={template.is_active ? "default" : "secondary"}>
                {template.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Preview: {template.name}</DialogTitle>
                </DialogHeader>
                <div 
                  className="border rounded-lg p-4 max-h-96 overflow-y-auto"
                  dangerouslySetInnerHTML={{ __html: template.html_content }}
                />
              </DialogContent>
            </Dialog>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(template)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(template.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Created: {new Date(template.created_at).toLocaleDateString()}
        </p>
        <p className="text-sm text-muted-foreground">
          Last updated: {new Date(template.updated_at).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  );
};