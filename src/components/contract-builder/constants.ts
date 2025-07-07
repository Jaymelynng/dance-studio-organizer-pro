import { Type, User, DollarSign, FileText, Image, Table, BarChart3, Minus, BookOpen, PenTool } from 'lucide-react';
import { ContractBuilderComponent, ContractElement } from './types';

export const contractComponents: ContractBuilderComponent[] = [
  // Basic Content
  { id: 'header', label: 'Header', icon: Type, category: 'content', description: 'Main title or section header' },
  { id: 'text', label: 'Text Block', icon: FileText, category: 'content', description: 'Paragraph or formatted text' },
  { id: 'divider', label: 'Divider', icon: Minus, category: 'content', description: 'Section separator line' },
  
  // Data Components
  { id: 'student-info', label: 'Student Info', icon: User, category: 'data', description: 'Student name, DOB, division' },
  { id: 'parent-info', label: 'Parent Info', icon: User, category: 'data', description: 'Parent contact information' },
  { id: 'tuition-table', label: 'Tuition Table', icon: DollarSign, category: 'data', description: 'Pricing and fee structure' },
  
  // Layout Components  
  { id: 'table', label: 'Custom Table', icon: Table, category: 'layout', description: 'Create custom data tables' },
  { id: 'image', label: 'Image', icon: Image, category: 'layout', description: 'Logo or custom image' },
  
  // Contract Sections
  { id: 'section', label: 'Policy Section', icon: BookOpen, category: 'policies', description: 'Attendance, conduct, etc.' },
  { id: 'signature', label: 'Signature Block', icon: PenTool, category: 'signatures', description: 'Digital signature area' },
  
  // Advanced
  { id: 'chart', label: 'Chart', icon: BarChart3, category: 'advanced', description: 'Data visualization' },
];

export const defaultContractElements: ContractElement[] = [
  {
    id: 'header-1',
    type: 'header',
    content: '{{company_name}}',
    styles: {
      fontSize: '32px',
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#2c3e50',
      marginBottom: '10px'
    }
  },
  {
    id: 'header-2', 
    type: 'header',
    content: 'Student Enrollment Agreement',
    styles: {
      fontSize: '24px',
      fontWeight: 'normal',
      textAlign: 'center',
      color: '#34495e',
      marginBottom: '5px'
    }
  },
  {
    id: 'header-3',
    type: 'header', 
    content: '{{season}} Season',
    styles: {
      fontSize: '18px',
      fontWeight: 'normal',
      textAlign: 'center',
      color: '#7f8c8d',
      marginBottom: '30px'
    }
  },
  {
    id: 'student-info-1',
    type: 'student-info',
    content: 'Student Information',
    data: {
      fields: ['name', 'dob', 'division']
    },
    styles: {
      marginBottom: '25px'
    }
  },
  {
    id: 'parent-info-1',
    type: 'parent-info',
    content: 'Parent/Guardian Information',
    data: {
      fields: ['name', 'address', 'phone', 'email']
    },
    styles: {
      marginBottom: '25px'
    }
  },
  {
    id: 'tuition-table-1',
    type: 'tuition-table',
    content: 'Tuition & Fees',
    data: {
      showDivisionRates: true,
      showMonthlyTuition: true,
      showPaymentTerms: true
    },
    styles: {
      marginBottom: '25px'
    }
  },
  {
    id: 'signature-1',
    type: 'signature',
    content: 'Signatures',
    data: {
      showParent: true,
      showStudent: true,
      showDirector: true
    },
    styles: {
      marginTop: '40px'
    }
  }
];

export const contractCategories = [
  { id: 'content', label: 'Content', description: 'Text, headers, and basic content' },
  { id: 'data', label: 'Student Data', description: 'Dynamic student and parent information' },
  { id: 'layout', label: 'Layout', description: 'Tables, images, and structure' },
  { id: 'policies', label: 'Policies', description: 'Contract terms and policies' },
  { id: 'signatures', label: 'Signatures', description: 'Digital signature blocks' },
  { id: 'advanced', label: 'Advanced', description: 'Charts and complex elements' }
];