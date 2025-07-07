import { X, Type, Palette, Layout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ContractElement } from './types';

interface ContractStylePanelProps {
  element: ContractElement;
  onUpdate: (updates: Partial<ContractElement>) => void;
  onClose: () => void;
}

export const ContractStylePanel = ({ element, onUpdate, onClose }: ContractStylePanelProps) => {
  const updateStyle = (property: string, value: string) => {
    onUpdate({
      styles: {
        ...element.styles,
        [property]: value
      }
    });
  };

  const updateContent = (content: string) => {
    onUpdate({ content });
  };

  const updateSettings = (settings: Record<string, any>) => {
    onUpdate({
      settings: {
        ...element.settings,
        ...settings
      }
    });
  };

  return (
    <div className="w-80 bg-background border-l border-border h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-semibold">Element Properties</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content" className="text-xs">
              <Type className="h-3 w-3 mr-1" />
              Content
            </TabsTrigger>
            <TabsTrigger value="style" className="text-xs">
              <Palette className="h-3 w-3 mr-1" />
              Style
            </TabsTrigger>
            <TabsTrigger value="layout" className="text-xs">
              <Layout className="h-3 w-3 mr-1" />
              Layout
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {element.type === 'header' && (
                  <div>
                    <Label className="text-xs">Header Text</Label>
                    <Input
                      value={element.content || ''}
                      onChange={(e) => updateContent(e.target.value)}
                      placeholder="Enter header text..."
                    />
                  </div>
                )}

                {element.type === 'text' && (
                  <div>
                    <Label className="text-xs">Text Content</Label>
                    <Textarea
                      value={element.content || ''}
                      onChange={(e) => updateContent(e.target.value)}
                      placeholder="Enter text content..."
                      rows={4}
                    />
                  </div>
                )}

                {element.type === 'section' && (
                  <>
                    <div>
                      <Label className="text-xs">Section Title</Label>
                      <Input
                        value={element.settings?.title || ''}
                        onChange={(e) => updateSettings({ title: e.target.value })}
                        placeholder="Enter section title..."
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Section Content</Label>
                      <Textarea
                        value={element.content || ''}
                        onChange={(e) => updateContent(e.target.value)}
                        placeholder="Enter section content..."
                        rows={6}
                      />
                    </div>
                  </>
                )}

                {(element.type === 'student-info' || element.type === 'parent-info' || element.type === 'tuition-table') && (
                  <div>
                    <Label className="text-xs">Section Title</Label>
                    <Input
                      value={element.content || ''}
                      onChange={(e) => updateContent(e.target.value)}
                      placeholder="Enter section title..."
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="style" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Typography</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs">Font Size</Label>
                  <Select
                    value={element.styles?.fontSize || '16px'}
                    onValueChange={(value) => updateStyle('fontSize', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12px">12px</SelectItem>
                      <SelectItem value="14px">14px</SelectItem>
                      <SelectItem value="16px">16px</SelectItem>
                      <SelectItem value="18px">18px</SelectItem>
                      <SelectItem value="20px">20px</SelectItem>
                      <SelectItem value="24px">24px</SelectItem>
                      <SelectItem value="32px">32px</SelectItem>
                      <SelectItem value="48px">48px</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs">Font Weight</Label>
                  <Select
                    value={element.styles?.fontWeight || 'normal'}
                    onValueChange={(value) => updateStyle('fontWeight', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="bold">Bold</SelectItem>
                      <SelectItem value="600">Semi Bold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs">Text Align</Label>
                  <Select
                    value={element.styles?.textAlign || 'left'}
                    onValueChange={(value) => updateStyle('textAlign', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs">Text Color</Label>
                  <Input
                    value={element.styles?.color || '#2c3e50'}
                    onChange={(e) => updateStyle('color', e.target.value)}
                    placeholder="#2c3e50"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="layout" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Spacing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs">Margin Bottom</Label>
                  <Select
                    value={element.styles?.marginBottom || '25px'}
                    onValueChange={(value) => updateStyle('marginBottom', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0px">0px</SelectItem>
                      <SelectItem value="10px">10px</SelectItem>
                      <SelectItem value="15px">15px</SelectItem>
                      <SelectItem value="20px">20px</SelectItem>
                      <SelectItem value="25px">25px</SelectItem>
                      <SelectItem value="30px">30px</SelectItem>
                      <SelectItem value="40px">40px</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs">Margin Top</Label>
                  <Select
                    value={element.styles?.marginTop || '0px'}
                    onValueChange={(value) => updateStyle('marginTop', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0px">0px</SelectItem>
                      <SelectItem value="10px">10px</SelectItem>
                      <SelectItem value="15px">15px</SelectItem>
                      <SelectItem value="20px">20px</SelectItem>
                      <SelectItem value="25px">25px</SelectItem>
                      <SelectItem value="30px">30px</SelectItem>
                      <SelectItem value="40px">40px</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs">Padding</Label>
                  <Select
                    value={element.styles?.padding || '0px'}
                    onValueChange={(value) => updateStyle('padding', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0px">0px</SelectItem>
                      <SelectItem value="8px">8px</SelectItem>
                      <SelectItem value="12px">12px</SelectItem>
                      <SelectItem value="16px">16px</SelectItem>
                      <SelectItem value="20px">20px</SelectItem>
                      <SelectItem value="24px">24px</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};