import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { TemplateElement } from './types';
import { Palette, Type, Layout, Settings } from 'lucide-react';

interface TemplateStylesProps {
  element: TemplateElement;
  onUpdate: (updates: Partial<TemplateElement>) => void;
}

export const TemplateStyles = ({ element, onUpdate }: TemplateStylesProps) => {
  const [activeTab, setActiveTab] = useState('content');

  const updateContent = (content: string) => {
    onUpdate({ content });
  };

  const updateStyle = (property: string, value: any) => {
    onUpdate({
      styles: {
        ...element.styles,
        [property]: value
      }
    });
  };

  const updateSetting = (property: string, value: any) => {
    onUpdate({
      settings: {
        ...element.settings,
        [property]: value
      }
    });
  };

  const fontFamilies = [
    { value: 'inherit', label: 'Default' },
    { value: 'Playfair Display', label: 'Playfair Display (Elegant)' },
    { value: 'Inter', label: 'Inter (Modern)' },
    { value: 'Georgia', label: 'Georgia (Classic)' },
    { value: 'Arial', label: 'Arial (Clean)' }
  ];

  const colorPresets = [
    { name: 'Primary', value: 'var(--primary)' },
    { name: 'Secondary', value: 'var(--secondary)' },
    { name: 'Accent', value: 'var(--accent)' },
    { name: 'Muted', value: 'var(--muted-foreground)' },
    { name: 'White', value: '#ffffff' },
    { name: 'Black', value: '#000000' }
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold">Element Properties</h3>
        <p className="text-sm text-muted-foreground capitalize">{element.type} Element</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-2">
          <TabsTrigger value="content" className="flex items-center gap-1">
            <Type className="h-3 w-3" />
            Content
          </TabsTrigger>
          <TabsTrigger value="style" className="flex items-center gap-1">
            <Palette className="h-3 w-3" />
            Style
          </TabsTrigger>
          <TabsTrigger value="layout" className="flex items-center gap-1">
            <Layout className="h-3 w-3" />
            Layout
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-auto">
          <TabsContent value="content" className="p-4 space-y-4">
            {(element.type === 'text' || element.type === 'signature') && (
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={element.content || ''}
                  onChange={(e) => updateContent(e.target.value)}
                  placeholder="Enter your content..."
                  className="min-h-32"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use {'{'}{'{'} variable_name {'}'}{'}'}  for dynamic content
                </p>
              </div>
            )}

            {element.type === 'button' && (
              <div>
                <Label htmlFor="button-text">Button Text</Label>
                <Input
                  id="button-text"
                  value={element.content || ''}
                  onChange={(e) => updateContent(e.target.value)}
                  placeholder="Button text..."
                />
              </div>
            )}

            {element.type === 'image' && (
              <div>
                <Label htmlFor="image-url">Image URL</Label>
                <Input
                  id="image-url"
                  type="url"
                  value={element.content || ''}
                  onChange={(e) => updateContent(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="style" className="p-4 space-y-6">
            {/* Typography */}
            {(element.type === 'text' || element.type === 'button' || element.type === 'signature') && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Typography</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Font Family</Label>
                    <Select 
                      value={element.styles?.fontFamily || 'inherit'} 
                      onValueChange={(value) => updateStyle('fontFamily', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fontFamilies.map(font => (
                          <SelectItem key={font.value} value={font.value}>
                            {font.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Font Size (px)</Label>
                    <Input
                      type="number"
                      value={parseInt(element.styles?.fontSize) || 16}
                      onChange={(e) => updateStyle('fontSize', `${e.target.value}px`)}
                      min="8"
                      max="72"
                    />
                  </div>

                  <div>
                    <Label>Font Weight</Label>
                    <Select 
                      value={element.styles?.fontWeight || 'normal'} 
                      onValueChange={(value) => updateStyle('fontWeight', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="500">Medium</SelectItem>
                        <SelectItem value="600">Semi Bold</SelectItem>
                        <SelectItem value="bold">Bold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Text Align</Label>
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
                        <SelectItem value="justify">Justify</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Colors */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Colors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Text Color</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {colorPresets.map(color => (
                      <Button
                        key={color.name}
                        variant="outline"
                        size="sm"
                        onClick={() => updateStyle('color', color.value)}
                        className="h-8 text-xs"
                        style={{ color: color.value }}
                      >
                        {color.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {(element.type === 'container' || element.type === 'button') && (
                  <div>
                    <Label>Background</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateStyle('backgroundColor', 'var(--primary)')}
                        className="h-8 text-xs"
                      >
                        Primary
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateStyle('backgroundColor', 'transparent')}
                        className="h-8 text-xs"
                      >
                        Transparent
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="layout" className="p-4 space-y-6">
            {/* Spacing */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Spacing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Padding</Label>
                  <Input
                    value={element.styles?.padding || '0px'}
                    onChange={(e) => updateStyle('padding', e.target.value)}
                    placeholder="20px"
                  />
                </div>

                <div>
                  <Label>Margin</Label>
                  <Input
                    value={element.styles?.margin || '0px'}
                    onChange={(e) => updateStyle('margin', e.target.value)}
                    placeholder="16px"
                  />
                </div>

                <div>
                  <Label>Margin Bottom</Label>
                  <Input
                    value={element.styles?.marginBottom || '16px'}
                    onChange={(e) => updateStyle('marginBottom', e.target.value)}
                    placeholder="16px"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Border & Effects */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Border & Effects</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Border Radius</Label>
                  <Input
                    value={element.styles?.borderRadius || '0px'}
                    onChange={(e) => updateStyle('borderRadius', e.target.value)}
                    placeholder="8px"
                  />
                </div>

                <div>
                  <Label>Border</Label>
                  <Input
                    value={element.styles?.border || 'none'}
                    onChange={(e) => updateStyle('border', e.target.value)}
                    placeholder="1px solid var(--border)"
                  />
                </div>

                {element.type === 'container' && (
                  <div>
                    <Label>Shadow</Label>
                    <Select 
                      value={element.styles?.boxShadow || 'none'} 
                      onValueChange={(value) => updateStyle('boxShadow', value === 'none' ? 'none' : value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="0 2px 8px rgba(0,0,0,0.1)">Subtle</SelectItem>
                        <SelectItem value="0 4px 16px rgba(0,0,0,0.15)">Medium</SelectItem>
                        <SelectItem value="0 8px 32px rgba(0,0,0,0.2)">Strong</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};