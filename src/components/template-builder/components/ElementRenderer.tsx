import { TemplateElement } from '../types';

interface ElementRendererProps {
  element: TemplateElement;
}

export const ElementRenderer = ({ element }: ElementRendererProps) => {
  const renderElement = () => {
    switch (element.type) {
      case 'text':
        return <div dangerouslySetInnerHTML={{ __html: element.content || '' }} />;
      
      case 'image':
        return (
          <img 
            src={element.content || '/placeholder.svg'} 
            alt="Template content" 
            className="max-w-full h-auto"
          />
        );
      
      case 'button':
        return (
          <button style={element.styles}>
            {element.content}
          </button>
        );
      
      case 'divider':
        return <hr />;
      
      case 'logo':
        return (
          <div className="flex justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-2">DEGAGÉ</div>
              <div className="text-sm text-muted-foreground">Classical Ballet</div>
            </div>
          </div>
        );
      
      case 'signature':
        return (
          <div style={{ whiteSpace: 'pre-line' }}>
            {element.content}
          </div>
        );
      
      case 'container':
        return (
          <div 
            style={{ 
              minHeight: '80px',
              padding: '20px',
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              ...element.styles 
            }}
          >
            {element.children && element.children.length > 0 ? (
              element.children.map(child => (
                <ElementRenderer key={child.id} element={child} />
              ))
            ) : (
              <div className="text-center text-muted-foreground text-sm py-4">
                Drop elements here to create content sections
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div style={element.styles}>
      {renderElement()}
    </div>
  );
};