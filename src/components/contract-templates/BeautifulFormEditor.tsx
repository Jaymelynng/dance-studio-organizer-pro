import { useState } from 'react';
import { EnglishFormData } from './EnglishEditor';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';

interface BeautifulFormEditorProps {
  formData: EnglishFormData;
  onChange: (field: keyof EnglishFormData, value: any) => void;
}

export const BeautifulFormEditor = ({ formData, onChange }: BeautifulFormEditorProps) => {
  const [editingField, setEditingField] = useState<string | null>(null);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTextEdit = (field: keyof EnglishFormData, value: any) => {
    onChange(field, value);
  };

  const EditableField = ({ 
    value, 
    fieldKey, 
    placeholder, 
    className = "",
    multiline = false,
    rows = 3
  }: {
    value: string;
    fieldKey: keyof EnglishFormData;
    placeholder: string;
    className?: string;
    multiline?: boolean;
    rows?: number;
  }) => {
    const isEditing = editingField === fieldKey;

    if (isEditing) {
      return multiline ? (
        <textarea
          value={value}
          onChange={(e) => handleTextEdit(fieldKey, e.target.value)}
          onBlur={() => setEditingField(null)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setEditingField(null);
            if (e.key === 'Enter' && !e.shiftKey && !multiline) {
              setEditingField(null);
            }
          }}
          className={`bg-white border-2 border-primary rounded px-2 py-1 resize-none ${className}`}
          rows={rows}
          autoFocus
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => handleTextEdit(fieldKey, e.target.value)}
          onBlur={() => setEditingField(null)}
          onKeyDown={(e) => {
            if (e.key === 'Escape' || e.key === 'Enter') setEditingField(null);
          }}
          className={`bg-white border-2 border-primary rounded px-2 py-1 ${className}`}
          autoFocus
        />
      );
    }

    return (
      <span
        onClick={() => setEditingField(fieldKey)}
        className={`cursor-pointer hover:bg-yellow-100 px-1 py-0.5 rounded transition-colors border-2 border-transparent hover:border-yellow-300 ${className}`}
        title="Click to edit"
      >
        {value || placeholder}
      </span>
    );
  };

  const SectionEditableField = ({ 
    section, 
    index, 
    field 
  }: {
    section: any;
    index: number;
    field: 'title' | 'content';
  }) => {
    const fieldKey = `section-${index}-${field}` as any;
    const isEditing = editingField === fieldKey;

    const updateSection = (newValue: string) => {
      const updatedSections = [...formData.contractSections];
      updatedSections[index] = { ...section, [field]: newValue };
      onChange('contractSections', updatedSections);
    };

    if (isEditing) {
      return field === 'content' ? (
        <div
          contentEditable
          dangerouslySetInnerHTML={{ __html: section[field] }}
          onBlur={(e) => {
            updateSection(e.currentTarget.innerHTML);
            setEditingField(null);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setEditingField(null);
          }}
          className="bg-white border-2 border-primary rounded p-2 min-h-20 focus:outline-none"
          style={{ minHeight: '80px' }}
        />
      ) : (
        <input
          type="text"
          value={section[field]}
          onChange={(e) => updateSection(e.target.value)}
          onBlur={() => setEditingField(null)}
          onKeyDown={(e) => {
            if (e.key === 'Escape' || e.key === 'Enter') setEditingField(null);
          }}
          className="bg-white border-2 border-primary rounded px-2 py-1 text-xl font-semibold"
          autoFocus
        />
      );
    }

    return (
      <div
        onClick={() => setEditingField(fieldKey)}
        className="cursor-pointer hover:bg-yellow-100 px-2 py-1 rounded transition-colors border-2 border-transparent hover:border-yellow-300"
        title="Click to edit"
      >
        {field === 'content' ? (
          <div dangerouslySetInnerHTML={{ __html: section[field] || '<p>Click to add content...</p>' }} />
        ) : (
          <h4 className="text-xl font-semibold text-primary">{section[field] || 'Section Title'}</h4>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen" style={{
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      lineHeight: '1.6',
      color: '#333',
      background: 'linear-gradient(135deg, #f8f6f4 0%, #f0ebe8 100%)'
    }}>
      <style>
        {`
          .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            border-radius: 20px;
            overflow: hidden;
          }

          .header {
            background: linear-gradient(135deg, #c8a2a5 0%, #b8969a 100%);
            color: white;
            padding: 40px;
            text-align: center;
          }

          .nav-container {
            background: #f8f9fa;
            border-bottom: 3px solid #c8a2a5;
            padding: 20px;
            position: sticky;
            top: 0;
            z-index: 100;
          }

          .table-of-contents {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
          }

          .toc-item {
            background: white;
            padding: 15px;
            border-radius: 10px;
            border-left: 4px solid #c8a2a5;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }

          .toc-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 20px rgba(0,0,0,0.15);
            border-left-color: #b8969a;
          }

          .section {
            margin-bottom: 60px;
            scroll-margin-top: 120px;
          }

          .section-header {
            background: linear-gradient(135deg, #c8a2a5 0%, #b8969a 100%);
            color: white;
            padding: 20px;
            margin: 0 -40px 30px -40px;
            text-align: center;
            border-radius: 10px;
          }

          .form-section {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 15px;
            margin-bottom: 30px;
            border: 2px solid #e9ecef;
          }

          .policy-section {
            background: white;
            padding: 25px;
            border-radius: 15px;
            margin-bottom: 20px;
            border-left: 5px solid #c8a2a5;
            box-shadow: 0 3px 10px rgba(0,0,0,0.1);
          }

          .back-to-top {
            background: linear-gradient(135deg, #c8a2a5 0%, #b8969a 100%);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 25px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin: 30px auto 0 auto;
            width: fit-content;
          }

          .back-to-top:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(200, 162, 165, 0.4);
          }
        `}
      </style>

      <div className="container">
        {/* Header */}
        <div className="header" id="top">
          <h1 style={{ fontSize: '2.5em', marginBottom: '10px', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
            <EditableField 
              value={formData.companyName} 
              fieldKey="companyName" 
              placeholder="COMPANY NAME"
              className="text-white"
            />
          </h1>
          <h2 style={{ fontSize: '1.2em', opacity: '0.9', fontWeight: '300' }}>
            Parent Contract <EditableField 
              value={formData.season} 
              fieldKey="season" 
              placeholder="2025/2026"
              className="text-white"
            /> Season
          </h2>
        </div>

        {/* Navigation */}
        <div className="nav-container">
          <div className="table-of-contents">
            <div className="toc-item" onClick={() => scrollToSection('student-info')}>
              <h3 style={{ color: '#c8a2a5', fontSize: '1.1em', marginBottom: '5px' }}>📋 Student Information</h3>
              <p style={{ color: '#666', fontSize: '0.9em' }}>Student and family details</p>
            </div>
            <div className="toc-item" onClick={() => scrollToSection('enrollment')}>
              <h3 style={{ color: '#c8a2a5', fontSize: '1.1em', marginBottom: '5px' }}>📝 Enrollment Agreement</h3>
              <p style={{ color: '#666', fontSize: '0.9em' }}>Training season and termination terms</p>
            </div>
            <div className="toc-item" onClick={() => scrollToSection('tuition')}>
              <h3 style={{ color: '#c8a2a5', fontSize: '1.1em', marginBottom: '5px' }}>💰 Tuition Fees</h3>
              <p style={{ color: '#666', fontSize: '0.9em' }}>Monthly rates and payment schedule</p>
            </div>
            {formData.contractSections.map((section, index) => (
              <div 
                key={section.id} 
                className="toc-item" 
                onClick={() => scrollToSection(`section-${index}`)}
              >
                <h3 style={{ color: '#c8a2a5', fontSize: '1.1em', marginBottom: '5px' }}>
                  📋 {section.title}
                </h3>
                <p style={{ color: '#666', fontSize: '0.9em' }}>Custom policy section</p>
              </div>
            ))}
            <div className="toc-item" onClick={() => scrollToSection('signatures')}>
              <h3 style={{ color: '#c8a2a5', fontSize: '1.1em', marginBottom: '5px' }}>✍️ Signatures</h3>
              <p style={{ color: '#666', fontSize: '0.9em' }}>Contract execution</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '40px' }}>
          {/* Student Information */}
          <div className="section" id="student-info">
            <div className="section-header">
              <h2>📋 STUDENT INFORMATION</h2>
            </div>

            <div className="form-section">
              <h3 style={{ color: '#c8a2a5', marginBottom: '20px', fontSize: '1.3em', borderBottom: '2px solid #c8a2a5', paddingBottom: '10px' }}>
                Student Details
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '15px', marginBottom: '15px', alignItems: 'center' }}>
                <label style={{ fontWeight: '600', color: '#495057' }}>Student Name:</label>
                <input type="text" placeholder="Enter student name" style={{ 
                  padding: '10px', 
                  border: '2px solid #e9ecef', 
                  borderRadius: '8px', 
                  fontSize: '1em' 
                }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '15px', marginBottom: '15px', alignItems: 'center' }}>
                <label style={{ fontWeight: '600', color: '#495057' }}>Date of Birth:</label>
                <input type="date" style={{ 
                  padding: '10px', 
                  border: '2px solid #e9ecef', 
                  borderRadius: '8px', 
                  fontSize: '1em' 
                }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '15px', marginBottom: '15px', alignItems: 'center' }}>
                <label style={{ fontWeight: '600', color: '#495057' }}>Parent/Guardian Names:</label>
                <input type="text" placeholder="Enter parent names" style={{ 
                  padding: '10px', 
                  border: '2px solid #e9ecef', 
                  borderRadius: '8px', 
                  fontSize: '1em' 
                }} />
              </div>
            </div>

            <div style={{ 
              padding: '15px', 
              borderRadius: '10px', 
              marginBottom: '20px', 
              borderLeft: '5px solid #c8a2a5',
              background: '#f8f6f4',
              color: '#6d4c4f'
            }}>
              <strong>Program Director Contact:</strong> <EditableField 
                value={formData.directorEmail} 
                fieldKey="directorEmail" 
                placeholder="director@studio.com"
              />
            </div>

            <button className="back-to-top" onClick={scrollToTop}>
              <ArrowUp className="h-4 w-4" />
              Back to Top
            </button>
          </div>

          {/* Enrollment Agreement */}
          <div className="section" id="enrollment">
            <div className="section-header">
              <h2>📝 ENROLLMENT AGREEMENT</h2>
            </div>

            <div className="form-section">
              <h3 style={{ color: '#c8a2a5', marginBottom: '20px', fontSize: '1.3em', borderBottom: '2px solid #c8a2a5', paddingBottom: '10px' }}>
                Training Season Commitment
              </h3>
              <p>
                We agree to enroll the student in <EditableField 
                  value={formData.companyName} 
                  fieldKey="companyName" 
                  placeholder="Studio Name"
                /> for the <EditableField 
                  value={formData.season} 
                  fieldKey="season" 
                  placeholder="2025/2026"
                /> season.
              </p>
            </div>

            <div className="policy-section">
              <h4 style={{ color: '#c8a2a5', marginBottom: '15px', fontSize: '1.2em' }}>Early Termination</h4>
              <p>
                Either party may terminate the agreement by providing written notice of at least{' '}
                <EditableField 
                  value={formData.terminationNotice} 
                  fieldKey="terminationNotice" 
                  placeholder="30"
                /> days and last month's tuition.
              </p>
            </div>

            <button className="back-to-top" onClick={scrollToTop}>
              <ArrowUp className="h-4 w-4" />
              Back to Top
            </button>
          </div>

          {/* Tuition Fees */}
          <div className="section" id="tuition">
            <div className="section-header">
              <h2>💰 TUITION FEES</h2>
            </div>

            <div className="form-section">
              <h3 style={{ color: '#c8a2a5', marginBottom: '20px', fontSize: '1.3em', borderBottom: '2px solid #c8a2a5', paddingBottom: '10px' }}>
                Monthly Tuition Rates
              </h3>
              
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                margin: '20px 0',
                background: 'white',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
              }}>
                <thead>
                  <tr style={{ background: 'linear-gradient(135deg, #c8a2a5 0%, #b8969a 100%)', color: 'white' }}>
                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Division</th>
                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Monthly Fee</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ background: '#f8f9fa' }}>
                    <td style={{ padding: '15px', borderBottom: '1px solid #e9ecef' }}>
                      <strong>Professional Division</strong>
                    </td>
                    <td style={{ padding: '15px', borderBottom: '1px solid #e9ecef' }}>
                      $<EditableField 
                        value={formData.professionalFee} 
                        fieldKey="professionalFee" 
                        placeholder="1800"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '15px', borderBottom: '1px solid #e9ecef' }}>
                      <strong>Pre-Professional Division</strong>
                    </td>
                    <td style={{ padding: '15px', borderBottom: '1px solid #e9ecef' }}>
                      $<EditableField 
                        value={formData.preProFee} 
                        fieldKey="preProFee" 
                        placeholder="1400"
                      />
                    </td>
                  </tr>
                  <tr style={{ background: '#f8f9fa' }}>
                    <td style={{ padding: '15px', borderBottom: '1px solid #e9ecef' }}>
                      <strong>Supplemental Division</strong>
                    </td>
                    <td style={{ padding: '15px', borderBottom: '1px solid #e9ecef' }}>
                      $<EditableField 
                        value={formData.supplementalFee} 
                        fieldKey="supplementalFee" 
                        placeholder="390"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="form-section">
              <h3 style={{ color: '#c8a2a5', marginBottom: '20px', fontSize: '1.3em', borderBottom: '2px solid #c8a2a5', paddingBottom: '10px' }}>
                Payment Schedule
              </h3>
              <p>
                <strong>Schedule:</strong> Tuition is due on the{' '}
                <EditableField 
                  value={formData.paymentDueDate} 
                  fieldKey="paymentDueDate" 
                  placeholder="1st"
                /> of each month. Invoices will go out on the{' '}
                <EditableField 
                  value={formData.invoiceSendDate} 
                  fieldKey="invoiceSendDate" 
                  placeholder="25th"
                /> of each month.
              </p>
              <p>
                <strong>Late fees:</strong> tuition over{' '}
                <EditableField 
                  value={formData.lateGracePeriod} 
                  fieldKey="lateGracePeriod" 
                  placeholder="3"
                /> days past due will incur a late fee of $<EditableField 
                  value={formData.lateFee} 
                  fieldKey="lateFee" 
                  placeholder="35"
                />.
              </p>
            </div>

            <button className="back-to-top" onClick={scrollToTop}>
              <ArrowUp className="h-4 w-4" />
              Back to Top
            </button>
          </div>

          {/* Dynamic Contract Sections */}
          {formData.contractSections.map((section, index) => (
            <div key={section.id} className="section" id={`section-${index}`}>
              <div className="section-header">
                <h2>
                  <SectionEditableField section={section} index={index} field="title" />
                </h2>
              </div>

              <div className="policy-section">
                <SectionEditableField section={section} index={index} field="content" />
              </div>

              <button className="back-to-top" onClick={scrollToTop}>
                <ArrowUp className="h-4 w-4" />
                Back to Top
              </button>
            </div>
          ))}

          {/* Signatures */}
          <div className="section" id="signatures">
            <div className="section-header">
              <h2>✍️ AGREEMENT ACKNOWLEDGMENT & SIGNATURES</h2>
            </div>

            <div style={{ 
              background: '#f8f9fa',
              padding: '30px',
              borderRadius: '15px',
              border: '3px dashed #c8a2a5'
            }}>
              <h3 style={{ textAlign: 'center', marginBottom: '30px', color: '#c8a2a5' }}>SIGNATURES</h3>
              
              <p style={{ marginBottom: '20px' }}>
                By signing below, we acknowledge that we have read, understood, and agree to the terms outlined in this contract.
              </p>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '2fr 1fr', 
                gap: '20px', 
                marginBottom: '20px', 
                alignItems: 'end' 
              }}>
                <div>
                  <label><strong>Parent/Guardian Signature:</strong></label>
                  <div style={{ 
                    borderBottom: '2px solid #333', 
                    paddingBottom: '5px', 
                    marginBottom: '5px' 
                  }}></div>
                </div>
                <div>
                  <label><strong>Date:</strong></label>
                  <div style={{ 
                    borderBottom: '2px solid #333', 
                    paddingBottom: '5px', 
                    marginBottom: '5px' 
                  }}></div>
                </div>
              </div>
            </div>

            <div style={{ 
              padding: '15px', 
              borderRadius: '10px', 
              marginBottom: '20px', 
              borderLeft: '5px solid #c8a2a5',
              background: '#f8f6f4',
              color: '#6d4c4f',
              marginTop: '20px'
            }}>
              <strong>Contact Information:</strong><br />
              Email: <EditableField 
                value={formData.directorEmail} 
                fieldKey="directorEmail" 
                placeholder="director@studio.com"
              /><br />
              Studio: <EditableField 
                value={formData.studioContact} 
                fieldKey="studioContact" 
                placeholder="Studio Name"
              />
            </div>

            <button className="back-to-top" onClick={scrollToTop}>
              <ArrowUp className="h-4 w-4" />
              Back to Top
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};