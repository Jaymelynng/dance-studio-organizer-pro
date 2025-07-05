import { Textarea } from '@/components/ui/textarea';

interface HtmlEditorProps {
  htmlContent: string;
  onChange: (content: string) => void;
}

export const HtmlEditor = ({ htmlContent, onChange }: HtmlEditorProps) => {
  return (
    <Textarea
      value={htmlContent}
      onChange={(e) => onChange(e.target.value)}
      className="min-h-[400px] font-mono text-sm"
    />
  );
};