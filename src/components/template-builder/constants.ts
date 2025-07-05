import { Type, Image, Layout, Plus, Settings, FileText } from 'lucide-react';
import { ComponentType, Template } from './types';

export const componentTypes: ComponentType[] = [
  { id: 'text', label: 'Text Block', icon: Type, category: 'content' },
  { id: 'image', label: 'Image', icon: Image, category: 'media' },
  { id: 'container', label: 'Container', icon: Layout, category: 'layout' },
  { id: 'button', label: 'Button', icon: Plus, category: 'interactive' },
  { id: 'divider', label: 'Divider', icon: Settings, category: 'layout' },
  { id: 'logo', label: 'Studio Logo', icon: Image, category: 'branding' },
  { id: 'signature', label: 'Signature', icon: FileText, category: 'branding' }
];

export const presetTemplates = {
  email: [
    {
      name: 'Welcome Message',
      description: 'Elegant welcome for new families',
      category: 'general',
      elements: [
        {
          id: '1',
          type: 'logo' as const,
          settings: { alignment: 'center', size: 'medium' }
        },
        {
          id: '2',
          type: 'text' as const,
          content: 'Welcome to Degagé Classical',
          styles: { 
            fontSize: '32px', 
            fontFamily: 'Playfair Display',
            color: 'var(--primary)',
            textAlign: 'center',
            marginBottom: '24px'
          }
        },
        {
          id: '3',
          type: 'text' as const,
          content: 'We are delighted to welcome {{student_name}} to our classical ballet family...',
          styles: { 
            fontSize: '16px',
            lineHeight: '1.6',
            color: 'var(--foreground)',
            marginBottom: '32px'
          }
        }
      ]
    },
    {
      name: 'Competition Announcement',
      description: 'Professional competition details',
      category: 'announcement',
      elements: [
        {
          id: '1',
          type: 'container' as const,
          styles: { 
            background: 'linear-gradient(135deg, var(--primary), var(--primary-glow))',
            padding: '32px',
            borderRadius: '12px',
            color: 'white'
          },
          children: [
            {
              id: '2',
              type: 'text' as const,
              content: 'Competition Season 2024',
              styles: { fontSize: '28px', fontWeight: 'bold', textAlign: 'center' }
            },
            {
              id: '3',
              type: 'text' as const,
              content: 'Registration Details & Schedule',
              styles: { fontSize: '16px', textAlign: 'center', opacity: '0.9' }
            }
          ]
        }
      ]
    },
    {
      name: 'Progress Update',
      description: 'Individual student progress',
      category: 'progress',
      elements: [
        {
          id: '1',
          type: 'text' as const,
          content: '{{student_name}}\'s Progress Report',
          styles: { 
            fontSize: '24px', 
            fontWeight: 'bold',
            color: 'var(--primary)',
            marginBottom: '16px'
          }
        },
        {
          id: '2',
          type: 'container' as const,
          styles: { 
            border: '2px solid var(--border)',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px'
          },
          children: [
            {
              id: '3',
              type: 'text' as const,
              content: 'Technical Progress',
              styles: { fontSize: '18px', fontWeight: '600', marginBottom: '8px' }
            },
            {
              id: '4',
              type: 'text' as const,
              content: '{{progress_notes}}',
              styles: { fontSize: '14px', lineHeight: '1.5' }
            }
          ]
        }
      ]
    }
  ] as Template[]
};