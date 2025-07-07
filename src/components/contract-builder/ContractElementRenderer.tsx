import { ContractElement } from './types';

interface ContractElementRendererProps {
  element: ContractElement;
}

export const ContractElementRenderer = ({ element }: ContractElementRendererProps) => {
  const renderElement = () => {
    switch (element.type) {
      case 'header':
        return (
          <div 
            className="p-4 border-2 border-dashed border-primary/30 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors"
            style={element.styles}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-xs text-muted-foreground font-medium">HEADER</span>
            </div>
            <div className="font-semibold text-foreground">
              {element.content || 'Header Text'}
            </div>
          </div>
        );

      case 'text':
        return (
          <div 
            className="p-4 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
            style={element.styles}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-muted-foreground font-medium">TEXT BLOCK</span>
            </div>
            <div className="text-sm text-foreground line-clamp-3">
              {element.content ? (
                <div dangerouslySetInnerHTML={{ __html: element.content.slice(0, 150) + (element.content.length > 150 ? '...' : '') }} />
              ) : (
                'Click to edit text content...'
              )}
            </div>
          </div>
        );

      case 'student-info':
        return (
          <div 
            className="p-4 border-2 border-dashed border-green-300 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
            style={element.styles}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-muted-foreground font-medium">STUDENT INFO</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-20 text-xs text-muted-foreground">Name:</span>
                <span className="text-sm bg-white px-2 py-1 rounded border">{'{{student_name}}'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-20 text-xs text-muted-foreground">DOB:</span>
                <span className="text-sm bg-white px-2 py-1 rounded border">{'{{student_dob}}'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-20 text-xs text-muted-foreground">Division:</span>
                <span className="text-sm bg-white px-2 py-1 rounded border">{'{{division}}'}</span>
              </div>
            </div>
          </div>
        );

      case 'parent-info':
        return (
          <div 
            className="p-4 border-2 border-dashed border-purple-300 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors"
            style={element.styles}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-xs text-muted-foreground font-medium">PARENT INFO</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-16 text-xs text-muted-foreground">Name:</span>
                <span className="text-sm bg-white px-2 py-1 rounded border">{'{{parent_names}}'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-16 text-xs text-muted-foreground">Address:</span>
                <span className="text-sm bg-white px-2 py-1 rounded border">{'{{parent_address}}'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-16 text-xs text-muted-foreground">Phone:</span>
                <span className="text-sm bg-white px-2 py-1 rounded border">{'{{parent_phone}}'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-16 text-xs text-muted-foreground">Email:</span>
                <span className="text-sm bg-white px-2 py-1 rounded border">{'{{parent_email}}'}</span>
              </div>
            </div>
          </div>
        );

      case 'tuition-table':
        return (
          <div 
            className="p-4 border-2 border-dashed border-orange-300 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors"
            style={element.styles}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-xs text-muted-foreground font-medium">TUITION & FEES</span>
            </div>
            <div className="bg-white rounded-lg p-3 border">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium">Professional:</div>
                <div className="text-right">{'{{professional_fee}}'}</div>
                <div className="font-medium">Pre-Pro:</div>
                <div className="text-right">{'{{pre_pro_fee}}'}</div>
                <div className="font-medium">Supplemental:</div>
                <div className="text-right">{'{{supplemental_fee}}'}</div>
              </div>
              <div className="mt-3 pt-2 border-t text-center">
                <span className="font-semibold">Your Tuition: {'{{monthly_tuition}}'}</span>
              </div>
            </div>
          </div>
        );

      case 'section':
        return (
          <div 
            className="p-4 border-2 border-dashed border-red-300 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
            style={element.styles}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-xs text-muted-foreground font-medium">POLICY SECTION</span>
            </div>
            <div className="bg-white rounded p-3 border">
              <h4 className="font-semibold text-sm mb-2 text-foreground">
                {element.settings?.title || 'Policy Section'}
              </h4>
              <div className="text-sm text-muted-foreground line-clamp-3">
                {element.content ? (
                  <div dangerouslySetInnerHTML={{ __html: element.content.slice(0, 100) + '...' }} />
                ) : (
                  'Click to add policy content...'
                )}
              </div>
            </div>
          </div>
        );

      case 'signature':
        return (
          <div 
            className="p-4 border-2 border-dashed border-indigo-300 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors"
            style={element.styles}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              <span className="text-xs text-muted-foreground font-medium">SIGNATURE BLOCK</span>
            </div>
            <div className="bg-white rounded p-3 border space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">Parent Signature</div>
                  <div className="h-8 border-b border-gray-400"></div>
                  <div className="text-xs text-muted-foreground mt-1">Date: ___________</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">Student Signature</div>
                  <div className="h-8 border-b border-gray-400"></div>
                  <div className="text-xs text-muted-foreground mt-1">Date: ___________</div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">Director Signature</div>
                <div className="h-8 border-b border-gray-400 max-w-xs mx-auto"></div>
                <div className="text-xs text-muted-foreground mt-1">Date: ___________</div>
              </div>
            </div>
          </div>
        );

      case 'divider':
        return (
          <div 
            className="p-2 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            style={element.styles}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              <span className="text-xs text-muted-foreground font-medium">DIVIDER</span>
            </div>
            <div className="h-0.5 bg-gray-300 rounded"></div>
          </div>
        );

      case 'image':
        return (
          <div 
            className="p-4 border-2 border-dashed border-pink-300 rounded-lg bg-pink-50 hover:bg-pink-100 transition-colors"
            style={element.styles}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
              <span className="text-xs text-muted-foreground font-medium">IMAGE</span>
            </div>
            {element.content ? (
              <img 
                src={element.content} 
                alt="Contract Image" 
                className="max-w-full h-auto rounded border bg-white"
              />
            ) : (
              <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-400">
                <span className="text-2xl">🖼️</span>
                <div className="text-sm">Click to add image</div>
              </div>
            )}
          </div>
        );

      case 'table':
        return (
          <div 
            className="p-4 border-2 border-dashed border-teal-300 rounded-lg bg-teal-50 hover:bg-teal-100 transition-colors"
            style={element.styles}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
              <span className="text-xs text-muted-foreground font-medium">CUSTOM TABLE</span>
            </div>
            <div className="bg-white rounded border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border border-gray-200 px-3 py-2 text-left">Column 1</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">Column 2</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">Column 3</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-200 px-3 py-2">Data 1</td>
                    <td className="border border-gray-200 px-3 py-2">Data 2</td>
                    <td className="border border-gray-200 px-3 py-2">Data 3</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-3 py-2">Data 4</td>
                    <td className="border border-gray-200 px-3 py-2">Data 5</td>
                    <td className="border border-gray-200 px-3 py-2">Data 6</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'chart':
        return (
          <div 
            className="p-4 border-2 border-dashed border-yellow-300 rounded-lg bg-yellow-50 hover:bg-yellow-100 transition-colors"
            style={element.styles}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-xs text-muted-foreground font-medium">CHART</span>
            </div>
            <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-400">
              <span className="text-3xl">📊</span>
              <div className="text-sm mt-2">Chart Component</div>
              <div className="text-xs text-gray-500">Charts coming soon</div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="contract-element">
      {renderElement()}
    </div>
  );
};