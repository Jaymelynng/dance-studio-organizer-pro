import { EnglishFormData } from './EnglishEditor';

// Function to generate HTML from English form data
export const generateHtmlFromEnglish = (englishData: EnglishFormData): string => {
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
    <p>Early termination requires ${englishData.terminationNotice} days written notice. Students dismissed for behavioral reasons remain financially responsible for ${englishData.dismissalPeriod} days following dismissal.</p>
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

  <div style="margin-bottom: 25px;">
    <h3 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 5px;">Studio Policies</h3>
    
    <h4 style="color: #34495e;">Attendance Policy</h4>
    <p>${englishData.attendancePolicy}</p>
    
    <h4 style="color: #34495e;">Injury Policy</h4>
    <p>${englishData.injuryPolicy}</p>
    
    <h4 style="color: #34495e;">Student Conduct</h4>
    <p>${englishData.conductPolicy}</p>
  </div>

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
        <div style="border-bottom: 1px solid #000; height: 40px; margin-bottom: 10px;"></div>
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

// Function to parse HTML and extract English form data (basic implementation)
export const parseHtmlToEnglish = (html: string): Partial<EnglishFormData> => {
  // This is a simplified parser - in a real app you'd want more robust parsing
  const parsed: Partial<EnglishFormData> = {};
  
  // Extract company name
  const companyMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
  if (companyMatch) parsed.companyName = companyMatch[1].trim();
  
  // Extract season
  const seasonMatch = html.match(/(\d{4}\/\d{4})/);
  if (seasonMatch) parsed.season = seasonMatch[1];
  
  return parsed;
};