import { EnglishFormData } from './EnglishEditor';
import { ContractSectionData } from './ContractSection';

// Function to generate HTML from English form data
export const generateHtmlFromEnglish = (englishData: EnglishFormData): string => {
  const sectionsHtml = englishData.contractSections?.map(section => `
    <div style="margin-bottom: 25px;">
      <h3 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 5px;">${section.title}</h3>
      ${section.content}
    </div>
  `).join('') || '';

  return `
<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #2c3e50; margin-bottom: 10px;">${englishData.companyName}</h1>
    <h2 style="color: #34495e; font-weight: normal;">Student Enrollment Agreement</h2>
    <h3 style="color: #7f8c8d; font-weight: normal;">${englishData.season} Season</h3>
  </div>

  <div style="margin-bottom: 25px;">
    <h3 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 5px;">Student Information</h3>
    <p><strong>Student Name:</strong> \{\{student_name\}\}</p>
    <p><strong>Date of Birth:</strong> \{\{student_dob\}\}</p>
    <p><strong>Division:</strong> \{\{division\}\}</p>
  </div>

  <div style="margin-bottom: 25px;">
    <h3 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 5px;">Parent/Guardian Information</h3>
    <p><strong>Parent/Guardian Name:</strong> \{\{parent_names\}\}</p>
    <p><strong>Address:</strong> \{\{parent_address\}\}</p>
    <p><strong>Phone:</strong> \{\{parent_phone\}\}</p>
    <p><strong>Email:</strong> \{\{parent_email\}\}</p>
  </div>

  <div style="margin-bottom: 25px;">
    <h3 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 5px;">Enrollment Agreement</h3>
    <p>This agreement is for the ${englishData.season} dance season${englishData.seasonStartDate && englishData.seasonEndDate ? ` (${englishData.seasonStartDate} - ${englishData.seasonEndDate})` : ''}.</p>
    <p>Early termination requires ${englishData.terminationNotice} days written notice.</p>
  </div>

  <div style="margin-bottom: 25px;">
    <h3 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 5px;">Tuition & Fees</h3>
    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
      <h4 style="margin-top: 0; color: #2c3e50;">Monthly Tuition Rates:</h4>
      <ul style="margin-bottom: 0;">
        <li><strong>Professional Division:</strong> $${englishData.professionalFee}</li>
        <li><strong>Pre-Professional Division:</strong> $${englishData.preProFee}</li>
        <li><strong>Supplemental Division:</strong> $${englishData.supplementalFee}</li>
      </ul>
    </div>
    <p><strong>Your Monthly Tuition:</strong> $\{\{monthly_tuition\}\}</p>
    <p>Tuition is due on the ${englishData.paymentDueDate} of each month. Invoices will be sent on the ${englishData.invoiceSendDate} of the previous month.</p>
    <p>Late payments incur a $${englishData.lateFee} fee after ${englishData.lateGracePeriod} days grace period.</p>
  </div>

  ${sectionsHtml}

  <div style="margin-bottom: 25px;">
    <h3 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 5px;">Contact Information</h3>
    <p><strong>Program Director:</strong> ${englishData.directorEmail}</p>
    <p><strong>Studio:</strong> ${englishData.studioContact}</p>
  </div>

  <div style="margin-top: 40px; border-top: 1px solid #bdc3c7; padding-top: 20px;">
    <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
      <div style="width: 45%;">
        <p><strong>Parent/Guardian Signature:</strong></p>
        <div style="border-bottom: 1px solid #000; height: 40px; margin-bottom: 10px;"></div>
        <p>Date: ________________</p>
      </div>
      <div style="width: 45%;">
        <p><strong>Student Signature (if 18+):</strong></p>
        <div style="border-bottom: 1px solid #000; height:40px; margin-bottom: 10px;"></div>
        <p>Date: ________________</p>
      </div>
    </div>
    <div style="text-align: center;">
      <p><strong>Director Signature:</strong></p>
      <div style="border-bottom: 1px solid #000; height: 40px; margin: 10px auto; width: 300px;"></div>
      <p>Date: ________________</p>
    </div>
  </div>
</div>`;
};

// Function to parse HTML and extract English form data
export const parseHtmlToEnglish = (html: string): Partial<EnglishFormData> => {
  const parsed: Partial<EnglishFormData> = {};
  
  try {
    // Extract company name
    const companyMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
    if (companyMatch) parsed.companyName = companyMatch[1].trim();
    
    // Extract season
    const seasonMatch = html.match(/(\d{4}\/\d{4})/);
    if (seasonMatch) parsed.season = seasonMatch[1];
    
    // Extract director email
    const directorMatch = html.match(/Director:\*\*\s*([^<\n]+)/);
    if (directorMatch) parsed.directorEmail = directorMatch[1].trim();
    
    // Extract studio contact
    const studioMatch = html.match(/Studio:\*\*\s*([^<\n]+)/);
    if (studioMatch) parsed.studioContact = studioMatch[1].trim();
    
    // Extract fees
    const professionalFeeMatch = html.match(/Professional Division:\*\*\s*\$(\d+)/);
    if (professionalFeeMatch) parsed.professionalFee = professionalFeeMatch[1];
    
    const preProFeeMatch = html.match(/Pre-Professional Division:\*\*\s*\$(\d+)/);
    if (preProFeeMatch) parsed.preProFee = preProFeeMatch[1];
    
    const supplementalFeeMatch = html.match(/Supplemental Division:\*\*\s*\$(\d+)/);
    if (supplementalFeeMatch) parsed.supplementalFee = supplementalFeeMatch[1];
    
    // Extract payment terms
    const dueDateMatch = html.match(/due on the (\d+(?:st|nd|rd|th)) of each month/);
    if (dueDateMatch) parsed.paymentDueDate = dueDateMatch[1];
    
    const invoiceDateMatch = html.match(/sent on the (\d+(?:st|nd|rd|th)) of the previous month/);
    if (invoiceDateMatch) parsed.invoiceSendDate = invoiceDateMatch[1];
    
    const lateFeeMatch = html.match(/\$(\d+) fee after (\d+) days grace period/);
    if (lateFeeMatch) {
      parsed.lateFee = lateFeeMatch[1];
      parsed.lateGracePeriod = lateFeeMatch[2];
    }
    
    // Extract termination notice
    const terminationMatch = html.match(/requires (\d+) days written notice/);
    if (terminationMatch) parsed.terminationNotice = terminationMatch[1];
    
    // Extract season dates
    const seasonDatesMatch = html.match(/\(([^)]+) - ([^)]+)\)/);
    if (seasonDatesMatch) {
      parsed.seasonStartDate = seasonDatesMatch[1].trim();
      parsed.seasonEndDate = seasonDatesMatch[2].trim();
    }
    
    // Extract contract sections - look for content between section headers
    const contractSections: ContractSectionData[] = [];
    
    // Find all h3 headers that aren't the main predefined ones
    const sectionMatches = html.matchAll(/<h3[^>]*>([^<]+)<\/h3>\s*(<div[^>]*>)?(.*?)(?=<h3|<div style="margin-top: 40px|$)/gs);
    
    let sectionIndex = 0;
    for (const match of sectionMatches) {
      const title = match[1].trim();
      let content = match[3].trim();
      
      // Skip predefined sections that are handled by form fields
      if (title.includes('Student Information') || 
          title.includes('Parent/Guardian Information') || 
          title.includes('Enrollment Agreement') || 
          title.includes('Tuition & Fees') || 
          title.includes('Contact Information')) {
        continue;
      }
      
      // Clean up content - remove extra divs and styling
      content = content.replace(/<div[^>]*>/g, '').replace(/<\/div>/g, '');
      
      if (content && title) {
        // Determine section type based on title
        let type: 'paragraph' | 'policy' | 'terms' | 'custom' = 'custom';
        if (title.toLowerCase().includes('policy')) {
          type = 'policy';
        } else if (title.toLowerCase().includes('terms') || title.toLowerCase().includes('agreement')) {
          type = 'terms';
        } else if (title.toLowerCase().includes('introduction') || title.toLowerCase().includes('overview')) {
          type = 'paragraph';
        }
        
        contractSections.push({
          id: `parsed-section-${sectionIndex++}`,
          title,
          content: content.trim(),
          type,
          order: sectionIndex,
        });
      }
    }
    
    // If no sections found, add some default sections
    if (contractSections.length === 0) {
      contractSections.push(
        {
          id: 'attendance-policy',
          title: 'Attendance Policy',
          content: '<p>Students are required to maintain regular attendance for optimal progress.</p>',
          type: 'policy',
          order: 0,
        },
        {
          id: 'injury-policy',
          title: 'Injury Policy',
          content: '<p>Students must inform instructors of any injuries or physical limitations.</p>',
          type: 'policy',
          order: 1,
        },
        {
          id: 'conduct-policy',
          title: 'Student Conduct Policy',
          content: '<p>Students are expected to maintain appropriate behavior and respect for others.</p>',
          type: 'policy',
          order: 2,
        }
      );
    }
    
    parsed.contractSections = contractSections;
    
  } catch (error) {
    console.error('Error parsing HTML:', error);
    // Return default sections on error
    parsed.contractSections = [
      {
        id: 'attendance-policy',
        title: 'Attendance Policy',
        content: '<p>Students are required to maintain regular attendance for optimal progress.</p>',
        type: 'policy',
        order: 0,
      }
    ];
  }
  
  return parsed;
};