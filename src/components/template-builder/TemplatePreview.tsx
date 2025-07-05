import { TemplateElement } from './types';

interface TemplatePreviewProps {
  elements: TemplateElement[];
}

export const TemplatePreview = ({ elements }: TemplatePreviewProps) => {
  const renderElement = (element: TemplateElement) => {
    switch (element.type) {
      case 'text':
        return (
          <div 
            key={element.id}
            style={element.styles}
            dangerouslySetInnerHTML={{ __html: element.content || '' }}
          />
        );
      
      case 'image':
        return (
          <img 
            key={element.id}
            src={element.content || '/placeholder.svg'} 
            alt="Template content"
            style={element.styles}
            className="max-w-full h-auto"
          />
        );
      
      case 'button':
        return (
          <button 
            key={element.id}
            style={element.styles}
          >
            {element.content}
          </button>
        );
      
      case 'divider':
        return <hr key={element.id} style={element.styles} />;
      
      case 'logo':
        return (
          <div key={element.id} style={element.styles} className="flex justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2" style={{ fontFamily: 'Playfair Display' }}>
                DEGAGÉ
              </div>
              <div className="text-lg text-muted-foreground">Classical Ballet</div>
              <div className="text-sm text-muted-foreground italic mt-1">Elegance in Life</div>
            </div>
          </div>
        );
      
      case 'signature':
        return (
          <div 
            key={element.id}
            style={{ ...element.styles, whiteSpace: 'pre-line' }}
          >
            {element.content}
          </div>
        );
      
      case 'container':
        return (
          <div 
            key={element.id} 
            style={{
              minHeight: '80px',
              padding: element.styles?.padding || '20px',
              backgroundColor: element.styles?.backgroundColor || element.styles?.background || 'var(--card)',
              border: element.styles?.border || '1px solid var(--border)',
              borderRadius: element.styles?.borderRadius || '8px',
              boxShadow: element.styles?.boxShadow,
              margin: element.styles?.margin,
              marginBottom: element.styles?.marginBottom,
              ...element.styles
            }}
          >
            {element.children && element.children.length > 0 ? (
              element.children.map(child => renderElement(child))
            ) : (
              <div className="text-center text-muted-foreground text-sm py-4">
                Empty container
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-card p-8">
        {elements.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">No content to preview</p>
            <p className="text-sm">Add some elements to see the preview</p>
          </div>
        ) : (
          <div className="space-y-0">
            {elements.map(element => renderElement(element))}
          </div>
        )}
      </div>
    </div>
  );
};