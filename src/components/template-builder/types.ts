export interface TemplateElement {
  id: string;
  type: 'text' | 'image' | 'container' | 'button' | 'divider' | 'logo' | 'signature';
  content?: string;
  styles?: Record<string, any>;
  children?: TemplateElement[];
  settings?: Record<string, any>;
}

export interface ComponentType {
  id: string;
  label: string;
  icon: any;
  category: string;
}

export interface Template {
  name: string;
  description: string;
  category: string;
  elements: TemplateElement[];
}