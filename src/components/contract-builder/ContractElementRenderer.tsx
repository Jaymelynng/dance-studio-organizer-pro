import { ContractElement } from './types';

interface ContractElementRendererProps {
  element: ContractElement;
}

export const ContractElementRenderer = ({ element }: ContractElementRendererProps) => {
  const renderElement = () => {
    switch (element.type) {
      case 'header':
        return (
          <div style={element.styles}>
            {element.content}
          </div>
        );

      case 'text':
        return (
          <div style={element.styles}>
            <div dangerouslySetInnerHTML={{ __html: element.content || '' }} />
          </div>
        );

      case 'student-info':
        return (
          <div style={element.styles}>
            <h3 style={{ 
              color: '#2c3e50', 
              borderBottom: '2px solid #3498db', 
              paddingBottom: '5px',
              marginBottom: '15px'
            }}>
              {element.content || 'Student Information'}
            </h3>
            <div style={{ marginBottom: '10px' }}>
              <strong>Student Name:</strong> {'{{student_name}}'}
            </div>
            <div style={{ marginBottom: '10px' }}>
              <strong>Date of Birth:</strong> {'{{student_dob}}'}
            </div>
            <div style={{ marginBottom: '10px' }}>
              <strong>Division:</strong> {'{{division}}'}
            </div>
          </div>
        );

      case 'parent-info':
        return (
          <div style={element.styles}>
            <h3 style={{ 
              color: '#2c3e50', 
              borderBottom: '2px solid #3498db', 
              paddingBottom: '5px',
              marginBottom: '15px'
            }}>
              {element.content || 'Parent/Guardian Information'}
            </h3>
            <div style={{ marginBottom: '10px' }}>
              <strong>Parent/Guardian Name:</strong> {'{{parent_names}}'}
            </div>
            <div style={{ marginBottom: '10px' }}>
              <strong>Address:</strong> {'{{parent_address}}'}
            </div>
            <div style={{ marginBottom: '10px' }}>
              <strong>Phone:</strong> {'{{parent_phone}}'}
            </div>
            <div style={{ marginBottom: '10px' }}>
              <strong>Email:</strong> {'{{parent_email}}'}
            </div>
          </div>
        );

      case 'tuition-table':
        return (
          <div style={element.styles}>
            <h3 style={{ 
              color: '#2c3e50', 
              borderBottom: '2px solid #3498db', 
              paddingBottom: '5px',
              marginBottom: '15px'
            }}>
              {element.content || 'Tuition & Fees'}
            </h3>
            
            <div style={{ 
              backgroundColor: '#f8f9fa', 
              padding: '15px', 
              borderRadius: '5px', 
              marginBottom: '15px' 
            }}>
              <h4 style={{ marginTop: '0', color: '#2c3e50', marginBottom: '10px' }}>
                Monthly Tuition Rates:
              </h4>
              <div style={{ marginBottom: '8px' }}>
                <strong>Professional Division:</strong> ${'{{professional_fee}}'}
              </div>
              <div style={{ marginBottom: '8px' }}>
                <strong>Pre-Professional Division:</strong> ${'{{pre_pro_fee}}'}
              </div>
              <div style={{ marginBottom: '0' }}>
                <strong>Supplemental Division:</strong> ${'{{supplemental_fee}}'}
              </div>
            </div>
            
            <div style={{ marginBottom: '10px' }}>
              <strong>Your Monthly Tuition:</strong> ${'{{monthly_tuition}}'}
            </div>
            
            <div style={{ marginBottom: '10px' }}>
              Tuition is due on the {'{{payment_due_date}}'} of each month. 
              Invoices will be sent on the {'{{invoice_send_date}}'} of the previous month.
            </div>
            
            <div>
              Late payments incur a ${'{{late_fee}}'} fee after {'{{late_grace_period}}'} days grace period.
            </div>
          </div>
        );

      case 'section':
        return (
          <div style={element.styles}>
            <h3 style={{ 
              color: '#2c3e50', 
              borderBottom: '2px solid #3498db', 
              paddingBottom: '5px',
              marginBottom: '15px'
            }}>
              {element.settings?.title || 'Policy Section'}
            </h3>
            <div dangerouslySetInnerHTML={{ 
              __html: element.content || '<p>Add your policy content here...</p>' 
            }} />
          </div>
        );

      case 'signature':
        return (
          <div style={{ 
            marginTop: '40px', 
            borderTop: '1px solid #bdc3c7', 
            paddingTop: '20px',
            ...element.styles 
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '20px'
            }}>
              <div style={{ minWidth: '250px' }}>
                <p><strong>Parent/Guardian Signature:</strong></p>
                <div style={{ 
                  borderBottom: '1px solid #000', 
                  height: '40px', 
                  marginBottom: '10px' 
                }} />
                <p>Date: ________________</p>
              </div>
              <div style={{ minWidth: '250px' }}>
                <p><strong>Student Signature (if 18+):</strong></p>
                <div style={{ 
                  borderBottom: '1px solid #000', 
                  height: '40px', 
                  marginBottom: '10px' 
                }} />
                <p>Date: ________________</p>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p><strong>Director Signature:</strong></p>
              <div style={{ 
                borderBottom: '1px solid #000', 
                height: '40px', 
                margin: '10px auto', 
                width: '300px' 
              }} />
              <p>Date: ________________</p>
            </div>
          </div>
        );

      case 'divider':
        return (
          <div style={{ 
            margin: '20px 0',
            borderBottom: '1px solid #ddd',
            ...element.styles 
          }} />
        );

      case 'image':
        return (
          <div style={{ textAlign: 'center', margin: '20px 0', ...element.styles }}>
            {element.content ? (
              <img 
                src={element.content} 
                alt="Contract Image" 
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            ) : (
              <div style={{ 
                border: '2px dashed #ddd', 
                padding: '40px', 
                borderRadius: '8px',
                color: '#999'
              }}>
                Click to add image
              </div>
            )}
          </div>
        );

      case 'table':
        return (
          <div style={element.styles}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              margin: '20px 0'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ 
                    border: '1px solid #ddd', 
                    padding: '12px', 
                    textAlign: 'left' 
                  }}>
                    Column 1
                  </th>
                  <th style={{ 
                    border: '1px solid #ddd', 
                    padding: '12px', 
                    textAlign: 'left' 
                  }}>
                    Column 2
                  </th>
                  <th style={{ 
                    border: '1px solid #ddd', 
                    padding: '12px', 
                    textAlign: 'left' 
                  }}>
                    Column 3
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ border: '1px solid #ddd', padding: '12px' }}>Data 1</td>
                  <td style={{ border: '1px solid #ddd', padding: '12px' }}>Data 2</td>
                  <td style={{ border: '1px solid #ddd', padding: '12px' }}>Data 3</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #ddd', padding: '12px' }}>Data 4</td>
                  <td style={{ border: '1px solid #ddd', padding: '12px' }}>Data 5</td>
                  <td style={{ border: '1px solid #ddd', padding: '12px' }}>Data 6</td>
                </tr>
              </tbody>
            </table>
          </div>
        );

      case 'chart':
        return (
          <div style={{ 
            textAlign: 'center', 
            margin: '20px 0', 
            padding: '40px',
            border: '2px dashed #ddd',
            borderRadius: '8px',
            color: '#999',
            ...element.styles 
          }}>
            📊 Chart Placeholder
            <br />
            <small>Charts coming soon</small>
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