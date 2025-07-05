interface TemplatePreviewProps {
  htmlContent: string;
}

export const TemplatePreview = ({ htmlContent }: TemplatePreviewProps) => {
  return (
    <div 
      className="border rounded-lg p-4 max-h-96 overflow-y-auto"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};