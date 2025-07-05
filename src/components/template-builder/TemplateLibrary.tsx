import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TemplateElement } from './types';
import { Mail, FileText, Megaphone, TrendingUp, Star } from 'lucide-react';

import { Template } from './types';

interface TemplateLibraryProps {
  templates: Template[];
  onSelectTemplate: (template: Template) => void;
}

export const TemplateLibrary = ({ templates, onSelectTemplate }: TemplateLibraryProps) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'general': return Mail;
      case 'announcement': return Megaphone;
      case 'progress': return TrendingUp;
      case 'marketing': return Star;
      default: return FileText;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'general': return 'bg-blue-100 text-blue-800';
      case 'announcement': return 'bg-green-100 text-green-800';
      case 'progress': return 'bg-purple-100 text-purple-800';
      case 'marketing': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const groupedTemplates = templates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, Template[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedTemplates).map(([category, categoryTemplates]) => (
        <div key={category}>
          <div className="flex items-center gap-2 mb-3">
            <Badge className={getCategoryColor(category)}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Badge>
          </div>
          
          <div className="space-y-3">
            {categoryTemplates.map((template, index) => {
              const IconComponent = getCategoryIcon(template.category);
              
              return (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4 text-muted-foreground" />
                        <CardTitle className="text-sm">{template.name}</CardTitle>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{template.description}</p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full"
                      onClick={() => onSelectTemplate(template)}
                    >
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}

      {templates.length === 0 && (
        <div className="text-center py-8">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No templates available</p>
          <p className="text-sm text-muted-foreground">Create your first template to get started</p>
        </div>
      )}
    </div>
  );
};