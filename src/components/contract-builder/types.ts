export interface ContractElement {
  id: string;
  type: 'header' | 'text' | 'student-info' | 'parent-info' | 'tuition-table' | 'section' | 'signature' | 'divider' | 'image' | 'table' | 'chart';
  content?: string;
  styles?: Record<string, any>;
  settings?: Record<string, any>;
  data?: any; // For dynamic content like student info, tuition rates, etc.
}

export interface ContractBuilderComponent {
  id: string;
  label: string;
  icon: any;
  category: string;
  description: string;
}

export interface ContractTemplate {
  id: string;
  name: string;
  elements: ContractElement[];
  settings: {
    companyName: string;
    season: string;
    pageSize: 'letter' | 'a4';
    margins: string;
  };
}