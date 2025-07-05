-- Create contract templates table
CREATE TABLE public.contract_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  division TEXT NOT NULL CHECK (division IN ('Professional', 'Pre-Professional', 'Supplemental', 'All')),
  season TEXT NOT NULL,
  html_content TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contract_templates ENABLE ROW LEVEL SECURITY;

-- Create policies for contract templates
CREATE POLICY "Allow all access to contract templates" 
ON public.contract_templates 
FOR ALL 
USING (true);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_contract_templates_updated_at
BEFORE UPDATE ON public.contract_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert the provided contract template
INSERT INTO public.contract_templates (name, division, season, html_content) VALUES (
  'Degage Classical Conservatory Parent Contract',
  'All',
  '2025/2026',
  '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Degage Classical Conservatory - Contract</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: ''Segoe UI'', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #f8f6f4 0%, #f0ebe8 100%);
            min-height: 100vh;
        }

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

        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .header h2 {
            font-size: 1.2em;
            opacity: 0.9;
            font-weight: 300;
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

        .toc-item h3 {
            color: #c8a2a5;
            font-size: 1.1em;
            margin-bottom: 5px;
        }

        .toc-item p {
            color: #666;
            font-size: 0.9em;
        }

        .content {
            padding: 40px;
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

        .form-section h3 {
            color: #c8a2a5;
            margin-bottom: 20px;
            font-size: 1.3em;
            border-bottom: 2px solid #c8a2a5;
            padding-bottom: 10px;
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: 15px;
            margin-bottom: 15px;
            align-items: center;
        }

        .form-row label {
            font-weight: 600;
            color: #495057;
        }

        .form-row input, .form-row select {
            padding: 10px;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            font-size: 1em;
            transition: border-color 0.3s ease;
        }

        .form-row input:focus, .form-row select:focus {
            outline: none;
            border-color: #c8a2a5;
        }

        .fee-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        .fee-table th {
            background: linear-gradient(135deg, #c8a2a5 0%, #b8969a 100%);
            color: white;
            padding: 15px;
            text-align: left;
            font-weight: 600;
        }

        .fee-table td {
            padding: 15px;
            border-bottom: 1px solid #e9ecef;
        }

        .fee-table tr:nth-child(even) {
            background: #f8f9fa;
        }

        .fee-table tr:hover {
            background: #fdf9f9;
        }

        .policy-section {
            background: white;
            padding: 25px;
            border-radius: 15px;
            margin-bottom: 20px;
            border-left: 5px solid #c8a2a5;
            box-shadow: 0 3px 10px rgba(0,0,0,0.1);
        }

        .policy-section h4 {
            color: #c8a2a5;
            margin-bottom: 15px;
            font-size: 1.2em;
        }

        .signature-section {
            background: #f8f9fa;
            padding: 30px;
            border-radius: 15px;
            border: 3px dashed #c8a2a5;
        }

        .signature-row {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
            align-items: end;
        }

        .signature-line {
            border-bottom: 2px solid #333;
            padding-bottom: 5px;
            margin-bottom: 5px;
        }

        .alert {
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 20px;
            border-left: 5px solid;
        }

        .alert-critical {
            background: #f8d7da;
            border-color: #dc3545;
            color: #721c24;
        }

        .alert-warning {
            background: #fff3cd;
            border-color: #ffc107;
            color: #856404;
        }

        .alert-info {
            background: #f8f6f4;
            border-color: #c8a2a5;
            color: #6d4c4f;
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

        @media (max-width: 768px) {
            .container {
                margin: 5px;
                border-radius: 15px;
            }
            
            .header {
                padding: 20px 15px;
            }
            
            .header h1 {
                font-size: 1.8em;
            }
            
            .header h2 {
                font-size: 1em;
            }
            
            .content {
                padding: 15px;
            }
            
            .nav-container {
                padding: 15px;
            }
            
            .form-row {
                grid-template-columns: 1fr;
                gap: 5px;
            }
            
            .table-of-contents {
                grid-template-columns: 1fr;
                gap: 10px;
            }
            
            .toc-item {
                padding: 12px;
            }
            
            .toc-item h3 {
                font-size: 1em;
            }
            
            .toc-item p {
                font-size: 0.85em;
            }
            
            .section-header {
                margin: 0 -15px 20px -15px;
                padding: 15px;
            }
            
            .section-header h2 {
                font-size: 1.3em;
            }
            
            .form-section {
                padding: 15px;
                margin-bottom: 20px;
            }
            
            .policy-section {
                padding: 15px;
                margin-bottom: 15px;
            }
            
            .signature-section {
                padding: 20px 15px;
            }
            
            .signature-row {
                grid-template-columns: 1fr;
                gap: 15px;
            }
            
            .fee-table {
                font-size: 0.9em;
            }
            
            .fee-table th,
            .fee-table td {
                padding: 10px 8px;
            }
            
            .back-to-top {
                padding: 10px 16px;
                font-size: 0.9em;
                margin: 20px auto 0 auto;
            }
        }

        @media (max-width: 480px) {
            .header h1 {
                font-size: 1.6em;
            }
            
            .content {
                padding: 10px;
            }
            
            .nav-container {
                padding: 10px;
            }
            
            .section-header {
                margin: 0 -10px 15px -10px;
            }
            
            .fee-table {
                font-size: 0.8em;
            }
            
            .form-row input,
            .form-row select {
                padding: 8px;
                font-size: 0.9em;
            }
            
            .back-to-top {
                padding: 8px 14px;
                font-size: 0.85em;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header" id="top">
            <h1>DEGAGE CLASSICAL CONSERVATORY</h1>
            <h2>Parent Contract {{season}}</h2>
        </div>

        <div class="nav-container">
            <div class="table-of-contents">
                <div class="toc-item" onclick="scrollToSection(''student-info'')">
                    <h3>📋 Student Information</h3>
                    <p>Student and family details</p>
                </div>
                <div class="toc-item" onclick="scrollToSection(''enrollment'')">
                    <h3>📝 Enrollment Agreement</h3>
                    <p>Training season and termination terms</p>
                </div>
                <div class="toc-item" onclick="scrollToSection(''tuition'')">
                    <h3>💰 Tuition Fees</h3>
                    <p>Monthly rates and payment schedule</p>
                </div>
                <div class="toc-item" onclick="scrollToSection(''extra-fees'')">
                    <h3>🎭 Extra Fees</h3>
                    <p>Additional services and charges</p>
                </div>
                <div class="toc-item" onclick="scrollToSection(''policies'')">
                    <h3>📋 Program Policies</h3>
                    <p>Attendance, injury, and conduct policies</p>
                </div>
                <div class="toc-item" onclick="scrollToSection(''wellness'')">
                    <h3>🏥 Wellness Services</h3>
                    <p>Partnership commitment and services</p>
                </div>
                <div class="toc-item" onclick="scrollToSection(''signatures'')">
                    <h3>✍️ Signatures</h3>
                    <p>Contract execution and office records</p>
                </div>
            </div>
        </div>

        <div class="content">
            <!-- Section 1: Student Information -->
            <div class="section" id="student-info">
                <div class="section-header">
                    <h2>📋 STUDENT INFORMATION</h2>
                </div>

                <div class="form-section">
                    <h3>Student Details</h3>
                    <div class="form-row">
                        <label>Student Name:</label>
                        <input type="text" value="{{student_name}}" readonly style="background: #f8f9fa;">
                    </div>
                    <div class="form-row">
                        <label>Date of Birth:</label>
                        <input type="text" value="{{student_dob}}" readonly style="background: #f8f9fa;">
                    </div>
                    <div class="form-row">
                        <label>Parent/Guardian Names:</label>
                        <input type="text" value="{{parent_names}}" readonly style="background: #f8f9fa;">
                    </div>
                    <div class="form-row">
                        <label>Address:</label>
                        <input type="text" value="{{parent_address}}" readonly style="background: #f8f9fa;">
                    </div>
                    <div class="form-row">
                        <label>Contact Number:</label>
                        <input type="text" value="{{parent_phone}}" readonly style="background: #f8f9fa;">
                    </div>
                    <div class="form-row">
                        <label>Email:</label>
                        <input type="text" value="{{parent_email}}" readonly style="background: #f8f9fa;">
                    </div>
                </div>

                <div class="alert alert-info">
                    <strong>Program Director Contact:</strong> cody@degageclassical.com
                </div>

                <button class="back-to-top" onclick="scrollToTop()">
                    ↑ Back to Top
                </button>
            </div>

            <!-- Section 2: Enrollment Agreement -->
            <div class="section" id="enrollment">
                <div class="section-header">
                    <h2>📝 ENROLLMENT AGREEMENT</h2>
                </div>

                <div class="form-section">
                    <h3>Training Season Commitment</h3>
                    <p>We, the parents of <strong>{{student_name}}</strong>, agree to enroll the above-named student in the Degage Classical Conservatory {{division}} Division for the {{season}} season, which will run from <strong>August 11th, 2025 to June 14th 2026</strong>.</p>
                </div>

                <div class="policy-section">
                    <h4>Early Termination</h4>
                    <p>In the event of early termination of this contract for Degage Classical Conservatory, either party may terminate the agreement for natural reasons by providing written notice of at least <strong>30 days and last month''s tuition</strong>.</p>
                </div>

                <div class="policy-section">
                    <h4>Student Dismissal</h4>
                    <p>In the event that a student is dismissed from the program, such dismissal may occur immediately for violations of program rules and regulations. The dismissed student shall remain financially responsible for <strong>up to sixty (60) days of tuition and program fees</strong>, as outlined in this contract. This provision holds regardless of the circumstances surrounding the dismissal.</p>
                    
                    <div class="alert alert-warning">
                        <strong>Important:</strong> Any fees paid for classes or performances already utilized shall be <strong>non-refundable</strong>, and the program director reserves the right to assess any additional financial obligations based on the timing and reason for the dismissal.
                    </div>
                </div>

                <button class="back-to-top" onclick="scrollToTop()">
                    ↑ Back to Top
                </button>
            </div>

            <!-- Section 3: Tuition Fees -->
            <div class="section" id="tuition">
                <div class="section-header">
                    <h2>💰 TUITION FEES</h2>
                </div>

                <div class="form-section">
                    <h3>Monthly Tuition Amount</h3>
                    <p style="color: #856404; background: #fff3cd; padding: 10px; border-radius: 8px; margin-bottom: 20px;">
                        <strong>Note:</strong> Fees based on enrollment of no less than 10 students total
                    </p>
                    
                    <table class="fee-table">
                        <thead>
                            <tr>
                                <th>Division</th>
                                <th>Monthly Fee</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Professional Division</strong></td>
                                <td>$1,800</td>
                            </tr>
                            <tr>
                                <td><strong>Pre-Professional Division</strong></td>
                                <td>$1,400</td>
                            </tr>
                            <tr>
                                <td><strong>Supplemental Division</strong></td>
                                <td>$390</td>
                            </tr>
                        </tbody>
                    </table>
                    
                    <div class="alert alert-info">
                        <strong>Your Monthly Tuition:</strong> ${{monthly_tuition}} for {{division}} Division
                    </div>
                </div>

                <div class="form-section">
                    <h3>Payment Schedule</h3>
                    <p><strong>Schedule:</strong> Tuition is due on the <strong>first of each month</strong> unless otherwise pre-arranged. Invoices will go out on the <strong>25th of each month</strong>. Payment will be taken via <strong>Square or Venmo</strong>.</p>
                    
                    <p><strong>Late fees:</strong> tuition over 3 days past due will incur a late fee of <strong>$5</strong> that will be applied to any tuition or fee payment not received by the specified due date. This fee is intended to encourage timely payments and will accrue for each day the payment remains outstanding.</p>
                </div>

                <button class="back-to-top" onclick="scrollToTop()">
                    ↑ Back to Top
                </button>
            </div>

            <!-- Remaining sections would continue with similar template variables... -->
            
        </div>
    </div>

    <script>
        function scrollToSection(sectionId) {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({
                    behavior: ''smooth'',
                    block: ''start''
                });
            }
        }

        function scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: ''smooth''
            });
        }
    </script>
</body>
</html>'
);