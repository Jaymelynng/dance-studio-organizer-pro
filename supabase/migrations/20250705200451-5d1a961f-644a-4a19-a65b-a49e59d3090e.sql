UPDATE contract_templates 
SET html_content = '<!DOCTYPE html>
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
                <div class="toc-item" onclick="scrollToSection(''enhancement-guide'')">
                    <h3>📋 Enhancement Guide</h3>
                    <p>Contract improvement checklist and recommendations</p>
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

            <!-- Section 4: Extra Fees -->
            <div class="section" id="extra-fees">
                <div class="section-header">
                    <h2>🎭 EXTRA FEES</h2>
                </div>

                <div class="form-section">
                    <h3>Annual Registration Fee</h3>
                    <table class="fee-table">
                        <thead>
                            <tr>
                                <th>Division</th>
                                <th>Annual Fee</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Professional & Pre-Professional Division</td>
                                <td>$350 per year</td>
                            </tr>
                            <tr>
                                <td>Supplemental Program</td>
                                <td>$200 per year</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="form-section">
                    <h3>Additional Services</h3>
                    <table class="fee-table">
                        <thead>
                            <tr>
                                <th>Service</th>
                                <th>Fee</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Private Lessons</td>
                                <td>$110 per hour</td>
                            </tr>
                            <tr>
                                <td>Director Choreography Fee (Contemporary Solo)</td>
                                <td>$500</td>
                            </tr>
                            <tr>
                                <td>Director Choreography Fee (Contemporary or Neo-Classical Duo)</td>
                                <td>$300</td>
                            </tr>
                            <tr>
                                <td>Director Choreography Fee (Contemporary Ensemble)</td>
                                <td>$150 per person</td>
                            </tr>
                            <tr>
                                <td>Classical Repertoire</td>
                                <td>No fees</td>
                            </tr>
                            <tr>
                                <td>Competition Registration fees</td>
                                <td>$25 fee added per registration</td>
                            </tr>
                            <tr>
                                <td>Competition Coaching Fee</td>
                                <td>$50 per session while at competition</td>
                            </tr>
                            <tr>
                                <td>Babysitting Fee</td>
                                <td>$75 per day during competitions or Intensives</td>
                            </tr>
                            <tr>
                                <td>Teacher Travel Fee</td>
                                <td>TBD (split equally between participants)</td>
                            </tr>
                            <tr>
                                <td>Audition Video Support</td>
                                <td>$20 per hour (studio rent) + $150 (teacher fee)</td>
                            </tr>
                            <tr>
                                <td>Production Fee</td>
                                <td>TBD (Plans for 2 Demonstrations in Black Box)</td>
                            </tr>
                        </tbody>
                    </table>
                    
                    <p><em>Outside choreography is allowed; fees will be determined by the hiring party.</em></p>
                    
                    <p><strong>Babysitting Fee Details:</strong> This applies if a parent cannot travel with the student, and the director is the caregiver responsible during the event. Housing arrangements will be divided among tenants, and a babysitting fee will be charged.</p>
                </div>

                <button class="back-to-top" onclick="scrollToTop()">
                    ↑ Back to Top
                </button>
            </div>

            <!-- Section 5: Policies -->
            <div class="section" id="policies">
                <div class="section-header">
                    <h2>📋 PROGRAM POLICIES</h2>
                </div>

                <div class="policy-section">
                    <h4>1. Attendance Policy</h4>
                    <p>Regular attendance is crucial for the success of our students and the overall integrity of the program. Students are expected to attend all scheduled classes and rehearsals. Absences must be communicated in advance to the director. Excessive unexcused absences may result in the removal of the student from the program at the discretion of the director.</p>
                </div>

                <div class="policy-section">
                    <h4>2. Dropped Enrollment</h4>
                    <p>Please see the "Tuition Policy" section</p>
                </div>

                <div class="policy-section">
                    <h4>3. Injury Policy</h4>
                    <p>Participants in the program acknowledge the physical demands of ballet and assume responsibility for their well-being. Any injuries incurred during classes, rehearsals, or performances must be reported to the instructor immediately. The studio does not assume liability for injuries sustained while participating in any studio-related activities. Students are encouraged to obtain personal health insurance to cover potential medical expenses resulting from injuries.</p>
                </div>

                <div class="policy-section">
                    <h4>4. Holidays and Substitutions</h4>
                    <p>The studio will observe designated holidays as outlined in the annual calendar. In many cases, DCC will hold optional Drop-in sessions that will be a separate fee due at the time of service. In the event of an instructor''s absence, the director reserves the right to substitute another qualified instructor to ensure continuity of training. Notice will be provided to students regarding any changes in teaching staff.</p>
                </div>

                <div class="policy-section">
                    <h4>5. Social Media Policy</h4>
                    <p>Students and staff are encouraged to share positive experiences from the studio on social media platforms. However, all individuals must professionally represent the studio, refraining from posting any content that could be deemed negative or detrimental to the studio''s or dancer''s reputation. All students must obtain permission from the director before posting any photographs or videos taken of class work, choreography, exams or performances.</p>
                </div>

                <div class="policy-section">
                    <h4>6. Professional Representation</h4>
                    <p>Students are expected to uphold the professional standards of the studio both inside and outside of the classroom. This includes respectful behavior towards instructors, fellow students, and staff, as well as maintaining a positive image of the program within the community. Any behavior that undermines the professional environment of the studio may result in disciplinary actions, including potential dismissal from the program.</p>
                </div>

                <div class="policy-section">
                    <h4>7. Parent-Director Communication</h4>
                    <p>Open and transparent communication between parents and the studio administration is essential for the well-being and development of the students. Parents are encouraged to reach out to the program director with any questions or concerns regarding their child''s progress, attendance or and other related issues. Scheduled meetings and feedback sessions will be made available to facilitate constructive dialogue, ensuring that both parents and the studio work collaboratively in the best interest of the student.</p>
                </div>

                <div class="policy-section">
                    <h4>8. Competition Coaching and Costume Supply</h4>
                    <p>For students enrolled in the professional division, competition coaching is included within the tuition fees. This coaching is designed to prepare students for upcoming competitions and is an integral part of their training. Pre-professional students may require supplemental support for competition preparation if time is limited due to outside restrictions. In such cases, additional coaching sessions may be recommended and will be the responsibility of the student or guardian to arrange. Should a student choose to add private lessons, separate fees will apply, which will be communicated and agreed upon before scheduling any private sessions.</p>
                    
                    <p>Costumes will be arranged with the director and the parent. Outside seamstress and costume companies are allowed.</p>
                </div>

                <button class="back-to-top" onclick="scrollToTop()">
                    ↑ Back to Top
                </button>
            </div>

            <!-- Section 6: Wellness Services -->
            <div class="section" id="wellness">
                <div class="section-header">
                    <h2>🏥 WELLNESS SERVICES & PARTNERSHIPS</h2>
                </div>

                <div class="form-section">
                    <h3>Commitment to Wellness Services and Partnerships</h3>
                    <p>Degage Classical Conservatory is dedicated to the overall wellness and health of its students. Based upon enrollment for the season, the studio commits to providing wellness services, which may include physical conditioning workshops, nutritional guidance, and injury prevention seminars in conjunction with our partnerships with our Wellness Professionals.</p>
                    
                    <p>These services are designed to support the students'' physical and mental well-being through their training. Participation in wellness programs will be made available to all enrolled students and is encouraged to foster a holistic approach to their ballet education. The studio reserves the right to adjust the availability of specific services based on enrollment numbers and program needs.</p>
                </div>

                <div class="form-section">
                    <h3>Wellness Partners</h3>
                    <table class="fee-table">
                        <thead>
                            <tr>
                                <th>Partner</th>
                                <th>Specialty</th>
                                <th>Contact</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Holly Nieman, MS, LAT, ATC, EMT, CES</td>
                                <td>Dance Sports Medicine Coordinator</td>
                                <td>469-303-2508</td>
                            </tr>
                            <tr>
                                <td>Jaclyn Sartore</td>
                                <td>Pilates Instructor & Health Coordinator</td>
                                <td>McKinney Movement Center</td>
                            </tr>
                            <tr>
                                <td>GotKnots</td>
                                <td>Massage Therapy</td>
                                <td>Pediatric & Adult Patients</td>
                            </tr>
                            <tr>
                                <td>Ballet Hotline (Sophia)</td>
                                <td>Mental Health Support</td>
                                <td>Emotional Resilience Coaching</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="alert alert-info">
                    <strong>Note:</strong> Wellness services are provided through independent partnerships. Families may contract directly with wellness professionals for additional support services.
                </div>

                <button class="back-to-top" onclick="scrollToTop()">
                    ↑ Back to Top
                </button>
            </div>

            <!-- Section 7: Signatures -->
            <div class="section" id="signatures">
                <div class="section-header">
                    <h2>✍️ AGREEMENT ACKNOWLEDGMENT & SIGNATURES</h2>
                </div>

                <div class="form-section">
                    <h3>Contract Agreement</h3>
                    <p>By signing this agreement, you acknowledge that you have read and understood these policies, and you agree to comply with all stipulations outlined herein.</p>
                </div>

                <div class="signature-section">
                    <h3 style="text-align: center; margin-bottom: 30px; color: #c8a2a5;">SIGNATURES</h3>
                    
                    <p style="margin-bottom: 20px;">By signing below, we acknowledge that we have read, understood, and agree to the terms outlined in this contract.</p>
                    
                    <div class="signature-row">
                        <div>
                            <label><strong>Parent/Guardian Signature:</strong></label>
                            <div class="signature-line"></div>
                        </div>
                        <div>
                            <label><strong>Date:</strong></label>
                            <div class="signature-line"></div>
                        </div>
                    </div>

                    <div class="signature-row">
                        <div>
                            <label><strong>Student Signature (if applicable):</strong></label>
                            <div class="signature-line"></div>
                        </div>
                        <div>
                            <label><strong>Date:</strong></label>
                            <div class="signature-line"></div>
                        </div>
                    </div>
                </div>

                <div class="form-section">
                    <h3>For Office Use Only</h3>
                    <table class="fee-table">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Amount</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Registration Fee Received:</td>
                                <td>$<input type="number" style="width: 80px; border: none; background: transparent;"></td>
                                <td><input type="date" style="border: none; background: transparent;"></td>
                            </tr>
                            <tr>
                                <td>Total Tuition:</td>
                                <td>$<input type="number" style="width: 80px; border: none; background: transparent;"></td>
                                <td><input type="text" style="border: none; background: transparent;" placeholder="Enrollment Confirmation"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="alert alert-info">
                    <strong>Contact Information:</strong><br>
                    Email: cody@degageclassical.com<br>
                    Website: degageclassical.com
                </div>

                <button class="back-to-top" onclick="scrollToTop()">
                    ↑ Back to Top
                </button>
            </div>

            <!-- Section 8: Contract Enhancement Guide -->
            <div class="section" id="enhancement-guide">
                <div class="section-header">
                    <h2>📋 CONTRACT ENHANCEMENT GUIDE</h2>
                </div>

                <div class="alert alert-critical">
                    <h3>🔴 CRITICAL ITEMS TO ADDRESS IMMEDIATELY</h3>
                    <ul style="margin-left: 20px; margin-top: 10px;">
                        <li><strong>Your contact details</strong> - Phone, email, business address needed in header</li>
                        <li><strong>Emergency contact procedures</strong> - How do parents reach you urgently?</li>
                        <li><strong>Medical requirements clarification</strong> - Annual physicals, clearance forms</li>
                        <li><strong>"10 students total" explanation</strong> - What happens if enrollment is lower?</li>
                        <li><strong>TBD items need estimates</strong> - Travel fees and production costs</li>
                    </ul>
                </div>

                <div class="alert alert-warning">
                    <h3>🟡 PROGRAM OPERATIONS QUESTIONS</h3>
                    <ul style="margin-left: 20px; margin-top: 10px;">
                        <li>How many classes per week does each division receive?</li>
                        <li>What''s the duration of each class?</li>
                        <li>How far in advance do you confirm class locations?</li>
                        <li>What constitutes "excessive absences"? (number per month)</li>
                        <li>Do you offer make-up classes? Under what circumstances?</li>
                        <li>What''s your preferred communication method with parents?</li>
                        <li>What are your dress code requirements for each division?</li>
                    </ul>
                </div>

                <div class="alert alert-info">
                    <h3>🔵 SUGGESTED ADDITIONS TO CONSIDER</h3>
                    <ul style="margin-left: 20px; margin-top: 10px;">
                        <li>Weather/Emergency Cancellation Policy</li>
                        <li>Parent Observation Guidelines</li>
                        <li>Photo/Video Release Forms</li>
                        <li>Equipment and Supply Lists</li>
                        <li>Competition Selection Criteria</li>
                        <li>Wellness Partner Contact Information</li>
                        <li>Medical Emergency Authorization</li>
                    </ul>
                </div>

                <div class="policy-section">
                    <h4>💡 WHAT''S WORKING WELL</h4>
                    <ul style="margin-left: 20px; color: #28a745;">
                        <li>✅ Clear fee structure for all services</li>
                        <li>✅ Comprehensive social media policy</li>
                        <li>✅ Professional conduct expectations</li>
                        <li>✅ Wellness services demonstrate program value</li>
                        <li>✅ Competition coaching details well-defined</li>
                        <li>✅ Parent communication emphasis</li>
                    </ul>
                    <p style="margin-top: 15px; font-style: italic;">Your contract has an excellent foundation! These enhancements will make it even stronger and more professional.</p>
                </div>

                <div class="form-section">
                    <h3>📝 Next Steps Checklist</h3>
                    <div style="display: grid; grid-template-columns: 1fr; gap: 10px;">
                        <label style="display: flex; align-items: center; gap: 10px;">
                            <input type="checkbox"> Add complete business contact information
                        </label>
                        <label style="display: flex; align-items: center; gap: 10px;">
                            <input type="checkbox"> Define class frequency and duration for each division
                        </label>
                        <label style="display: flex; align-items: center; gap: 10px;">
                            <input type="checkbox"> Clarify attendance and make-up policies
                        </label>
                        <label style="display: flex; align-items: center; gap: 10px;">
                            <input type="checkbox"> Add wellness partner contact information
                        </label>
                        <label style="display: flex; align-items: center; gap: 10px;">
                            <input type="checkbox"> Establish emergency contact procedures
                        </label>
                        <label style="display: flex; align-items: center; gap: 10px;">
                            <input type="checkbox"> Consider legal review for liability protection
                        </label>
                    </div>
                </div>

                <button class="back-to-top" onclick="scrollToTop()">
                    ↑ Back to Top
                </button>
            </div>
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
WHERE name = 'Degage Classical Conservatory Parent Contract';