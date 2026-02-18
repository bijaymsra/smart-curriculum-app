import React, { useEffect } from "react";
import './Docs.css';

export default function Docs() {
  // Helpers (shared)
  const toStr = (v) => (v == null ? "" : String(v));
  const normalize = (s) => toStr(s).trim().toLowerCase();

  function findTabElement(tabName) {
    if (!tabName) return null;
    // direct id match
    let el = document.getElementById(tabName);
    if (el) return el;
    // case-insensitive id match among .tab-content
    const candidates = Array.from(document.querySelectorAll(".tab-content"));
    const nameLower = normalize(tabName);
    return candidates.find(c => c.id && normalize(c.id) === nameLower) || null;
  }

  // Programmatic openTab that the JSX onClick handlers call
  function openTabProgrammatic(tabName, evt = null) {
    const tabContents = Array.from(document.getElementsByClassName("tab-content"));
    tabContents.forEach(tc => tc.classList.remove("active"));

    const tabButtonsAll = Array.from(document.getElementsByClassName("tab-btn"));
    tabButtonsAll.forEach(tb => tb.classList.remove("active"));

    const targetTab = findTabElement(tabName);
    if (targetTab) targetTab.classList.add("active");

    // If we have an event and currentTarget, prefer that button to mark active
    let callerButton = evt && evt.currentTarget ? evt.currentTarget : (evt && evt.target ? evt.target : null);

    if (callerButton && callerButton.classList && !callerButton.classList.contains("tab-btn")) {
      callerButton = callerButton.closest ? callerButton.closest(".tab-btn") : callerButton;
    }

    if (callerButton && callerButton.classList && callerButton.classList.contains("tab-btn")) {
      callerButton.classList.add("active");
    } else {
      // fallback: match button by data-tab / aria-controls / href / text
      tabButtonsAll.forEach(btn => {
        const candidate =
          (btn.dataset && btn.dataset.tab) ||
          btn.getAttribute("data-tab") ||
          btn.getAttribute("aria-controls") ||
          (btn.getAttribute("href") || "").replace("#", "") ||
          btn.textContent;
        if (normalize(candidate).includes(normalize(tabName))) {
          btn.classList.add("active");
        }
      });
    }
  }

  // Keep FAQ accordion wiring in useEffect (clean up on unmount)
  useEffect(() => {
    if (typeof document === "undefined") return;

    const faqItems = Array.from(document.querySelectorAll(".faq-item"));
    faqItems.forEach(item => {
      const handler = (e) => {
        const clicked = e.currentTarget;
        faqItems.forEach(other => {
          if (other !== clicked && other.classList.contains("active")) {
            other.classList.remove("active");
          }
        });
        clicked.classList.toggle("active");
      };
      item.addEventListener("click", handler);
      item._cleanup = handler;
    });

    // Initial activation: pick any button already active else first tab-btn
    const tabButtons = Array.from(document.querySelectorAll(".tab-btn"));
    if (tabButtons.length) {
      const pre = tabButtons.find(b => b.classList.contains("active"));
      const starter = pre || tabButtons[0];
      const starterName =
        (starter.dataset && starter.dataset.tab) ||
        starter.getAttribute("data-tab") ||
        starter.getAttribute("aria-controls") ||
        (starter.getAttribute("href") || "").replace("#", "") ||
        starter.textContent;
      openTabProgrammatic(starterName);
    }

    return () => {
      Array.from(document.querySelectorAll(".faq-item")).forEach(item => {
        if (item._cleanup) {
          item.removeEventListener("click", item._cleanup);
          delete item._cleanup;
        }
      });
    };
  }, []); // run once

  // JSX: use onClick to call openTabProgrammatic
  return (
    <div>
      {/* Navigation  */}
      <nav className="docsnavbar">
        <div className="nav-container">
          <a href="/" className="doclogo">Attenza</a>
          <ul className="nav-links">
            <li><a href="about">About</a></li>
            <li><a href="/" className="back-btn">← Back to Home</a></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section  */}
      <section className="docshero">
        <h1>Documentation & Help Center</h1>
        <p>Everything you need to know about using our platform</p>
      </section>

      {/* Tab Navigation - React onClick handlers */}
      <div className="tab-container">
        <div className="tabs">
          <button
            className="tab-btn active"
            data-tab="docs"
            onClick={(e) => openTabProgrammatic("docs", e)}
          >
            📚 Documentation
          </button>

          <button
            className="tab-btn"
            data-tab="help"
            onClick={(e) => openTabProgrammatic("help", e)}
          >
            ❓ Help & FAQ
          </button>

          <button
            className="tab-btn"
            data-tab="privacy"
            onClick={(e) => openTabProgrammatic("privacy", e)}
          >
            🔒 Privacy Policy
          </button>

          <button
            className="tab-btn"
            data-tab="terms"
            onClick={(e) => openTabProgrammatic("terms", e)}
          >
            📋 Terms of Service
          </button>
        </div>
      </div>

      {/* Content Container */}
      <div className="container">
        {/* Documentation Tab  */}
        <div id="docs" className="tab-content active">
          {/* (your existing documentation content — kept unchanged) */}
          <div className="doc-section">
            <h2>📚 Getting Started</h2>
            <h3>System Overview</h3>
            <p>The Smart Curriculum & Personalized System Management is a unified platform that automates attendance tracking while enhancing student productivity through intelligent scheduling. The system leverages advanced technologies dynamic QR code scanning identification.</p>

                <div className="info-box">
                    <strong>🎯 Key Features:</strong> Automated attendance marking, real-time dashboards, personalized task recommendations, predictive scheduling, and seamless LMS/ERP integration.
                </div>

                <h3>Technical Architecture</h3>
                <p>Our system comprises three core modules:</p>
                
                <h4>1. Automated Attendance Engine</h4>
                <ul>
                    <li><strong>QR Code System:</strong> Dynamic, time-limited QR codes with 99% accuracy and built-in fraud prevention</li>
                </ul>

                <h4>2. Personalized Planner Module</h4>
                <p>Integrates timetable data, academic progress, and career preferences to recommend productive activities during free slots. Uses collaborative filtering and reinforcement learning for adaptive suggestions.</p>

                <h4>3. Web/Mobile Interface</h4>
                <ul>
                    <li><strong>Backend:</strong>Spring Boot, MySQL</li>
                    <li><strong>Cloud Platform:</strong> AWS (S3 storage, EC2 computation, Lambda functions)</li>
                    <li><strong>Frontend:</strong> React Web dashboard</li>
                    <li><strong>Security:</strong> SSL-based communication, encrypted QR codes, JWT Authentication</li>
                </ul>

                <h3>System Requirements</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Component</th>
                            <th>Minimum Requirement</th>
                            <th>Recommended</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Web Browser</td>
                            <td>Chrome 90+, Firefox 88+, Safari 14+</td>
                            <td>Latest version</td>
                        </tr>
                        <tr>
                            <td>Mobile OS</td>
                            <td>Android 8.0+ / iOS 12+</td>
                            <td>Android 11+ / iOS 15+</td>
                        </tr>
                        <tr>
                            <td>Internet Connection</td>
                            <td>2 Mbps</td>
                            <td>5+ Mbps</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="doc-section">
                <h2>👤 User Roles & Access</h2>
                
                <h3>Student Access</h3>
                <ul>
                    <li>View attendance summary (daily/weekly/monthly)</li>
                    <li>Mark attendance via Session based QR-Code</li>
                    <li>Access personalized planner with task recommendations</li>
                    <li>Manage class schedule and timetable</li>
                    <li>Create and track personal tasks and to-dos</li>
                    <li>Receive notifications and alerts</li>
                    <li>Manage profile and privacy settings</li>
                </ul>

                <h3>Faculty Access</h3>
                <ul>
                    <li>View live classroom attendance</li>
                    <li>Access digital roll-call tools</li>
                    <li>Review class roster and student profiles</li>
                    <li>Process manual corrections and exceptions</li>
                    <li>Generate and export reports (CSV/PDF)</li>
                    <li>View analytics and attendance trends</li>
                </ul>

                <h3>Admin Access</h3>
                <ul>
                    <li>Manage courses, batches, and timetables</li>
                    <li>Import/export user data</li>
                    <li>Configure attendance policies and thresholds</li>
                    <li>Access system-wide analytics and reports</li>
                    <li>Manage LMS/ERP integrations</li>
                    <li>Configure system settings and permissions</li>
                </ul>
            </div>

            <div className="doc-section">
                <h2>🚀 Quick Start Guide</h2>
                
                <h3>For Students</h3>
                <ol>
                    <li><strong>Initial Setup:</strong>
                        <ul>
                            <li>Receive invitation email from your institution</li>
                            <li>Click activation link and create password</li>
                            <li>Complete profile setup with photo upload</li>
                            <li>Enable camera permissions (for Qr-Code Scanning)</li>
                        </ul>
                    </li>
                    <li><strong>Marking Attendance:</strong>
                        <ul>
                            <li><em>QR Code:</em> Scan faculty-displayed QR code using web camera</li>
                        </ul>
                    </li>
                    <li><strong>Using the Planner:</strong>
                        <ul>
                            <li>Review daily schedule on dashboard</li>
                            <li>Check recommended tasks for free slots</li>
                            <li>Add custom tasks and set priorities</li>
                            <li>Mark tasks complete for progress tracking</li>
                        </ul>
                    </li>
                </ol>

                <div className="success-box">
                    <strong>✅ Pro Tip:</strong> Enable push notifications to receive reminders for upcoming classNamees and suggested tasks during free periods.
                </div>

                <h3>For Faculty</h3>
                <ol>
                    <li>Log in to faculty dashboard</li>
                    <li>Select course and class session</li>
                    <li>Start attendance Session (display QR Code)</li>
                    <li>Monitor real-time attendance marking</li>
                    <li>Review and approve any pending corrections</li>
                    <li>Export attendance reports as needed</li>
                </ol>

                <h3>For Administrators</h3>
                <ol>
                    <li>Access admin panel with institutional credentials</li>
                    <li>Import student/faculty data (CSV/Excel format)</li>
                    <li>Create courses and assign batches</li>
                    <li>Configure timetables and schedules</li>
                    <li>Set attendance policies (minimum percentage, grace periods)</li>
                    <li>Configure system integrations (LMS, ERP)</li>
                </ol>
            </div>

            <div className="doc-section">
                <h2>⚙️ Advanced Features</h2>
                
                <h3>Predictive Scheduling Algorithm</h3>
                <p>Our planner uses machine learning to analyze your schedule, academic performance, and goals to recommend optimal activities for free time:</p>
                <ul>
                    <li><strong>Collaborative Filtering:</strong> Learns from similar student patterns</li>
                    <li><strong>Reinforcement Learning:</strong> Adapts based on your task completion and feedback</li>
                    <li><strong>Goal Alignment:</strong> Prioritizes activities matching your career and academic objectives</li>
                </ul>

                <div className="info-box">
                    <strong>📊 Research-Backed:</strong> Testing with 100 students showed 30% better time utilization and 10% higher task completion over four weeks.
                </div>

                <h3>NEP 2020 Alignment</h3>
                <p>Our platform supports the National Education Policy 2020 framework by:</p>
                <ul>
                    <li>Enabling personalized learning paths</li>
                    <li>Supporting competency-based progress tracking</li>
                    <li>Facilitating technology-enabled education</li>
                    <li>Promoting holistic skill development</li>
                    <li>Reducing administrative burden on educators</li>
                </ul>

                <h3>Integration APIs</h3>
                <p>Connect with existing systems using our REST APIs:</p>

                <div className="code-block">
                <pre>
                {`POST /api/v1/attendance/mark
                Content-Type: application/json
                Authorization: Bearer {token}

                {
                "student_id": "12345",
                "class_id": "CS101",
                "timestamp": "2024-11-06T10:30:00Z"
                }`}
                </pre>
                </div>

                <div className="warning-box">
                    <strong>⚠️ Note:</strong> API access requires institutional admin approval. Contact support@smartattendance.edu for API documentation and credentials.
                </div>
            </div>
            </div>


        {/* Help & FAQ Tab */}
        <div id="help" className="tab-content">
          <div className="doc-section">
            <h2>❓ Frequently Asked Questions</h2>

            <div className="faq-item">
              <div className="faq-question">How accurate is the QR rCode system?</div>
              <div className="faq-answer">Our QR Code system achieves good accuracy as it is session based dynamically changes every 30 sec...</div>
            </div>

            <div className="faq-item">
              <div className="faq-question">Can students mark proxy attendance?</div>
              <div className="faq-answer">No. Our system includes fraud prevention measures ...</div>
            </div>

            {/* ... rest of FAQ items ... */}

                <div className="faq-item">
                    <div className="faq-question">What happens if I forget to mark attendance?</div>
                    <div className="faq-answer">
                        Faculty members can manually mark or correct attendance within a specified grace period (typically 24 hours). Students can also submit exception requests with valid reasons through the app, which faculty can review and approve. The system maintains an audit trail of all manual corrections.
                    </div>
                </div>

                <div className="faq-item">
                    <div className="faq-question">How does the personalized planner work?</div>
                    <div className="faq-answer">
                        The planner analyzes your class schedule, academic performance, stated goals, and task completion patterns to recommend productive activities for free time slots. It uses machine learning (collaborative filtering and reinforcement learning) to continuously improve suggestions based on your feedback and behavior. You can also add custom tasks and priorities.
                    </div>
                </div>

                <div className="faq-item">
                    <div className="faq-question">Is my personal data secure?</div>
                    <div className="faq-answer">
                        Yes. We implement enterprise-grade security including SSL encryption for all communications, encrypted storage of biometric data, GDPR compliance, role-based access controls, and regular security audits. Facial recognition data is hashed and cannot be reverse-engineered. You can request data deletion at any time through your profile settings.
                    </div>
                </div>

                <div className="faq-item">
                    <div className="faq-question">Can I use the system offline?</div>
                    <div className="faq-answer">
                        Limited offline functionality is available. You can view previously synced schedules and tasks offline. However, attendance marking requires internet connectivity for real-time verification and fraud prevention. The app will queue actions and sync automatically when connection is restored.
                    </div>
                </div>

                <div className="faq-item">
                    <div className="faq-question">How do I export my attendance reports?</div>
                    <div className="faq-answer">
                        Students can download their attendance summary as PDF from the dashboard. Faculty can export class-wise reports in CSV or PDF format with customizable date ranges and filters. Administrators have access to bulk export options for institutional reporting and compliance.
                    </div>
                </div>

                <div className="faq-item">
                    <div className="faq-question">What are the minimum attendance requirements?</div>
                    <div className="faq-answer">
                        Attendance requirements are set by your institution's policies and configured by administrators in the system. You can view your current attendance percentage and required threshold on your dashboard. The system will alert you if your attendance falls below the minimum requirement.
                    </div>
                </div>

                <div className="faq-item">
                    <div className="faq-question">Who do I contact for technical support?</div>
                    <div className="faq-answer">
                        For technical issues: Email support@smartattendance.edu or use the in-app help button. For account/access issues: Contact your institution's admin. For general inquiries: Visit our help center at docs.smartattendance.edu. Average response time is under 4 hours during business days.
                    </div>
                </div>
            </div>

            <div className="doc-section">
                <h2>🔧 Troubleshooting</h2>
                <h3>QR Code Issues</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Problem</th>
                            <th>Solution</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>QR code expired</td>
                            <td>QR codes refresh every 2 minutes; ask faculty to display new code</td>
                        </tr>
                        <tr>
                            <td>QR code won't scan</td>
                            <td>Ensure good lighting, hold phone steady, try different angle, clean camera lens</td>
                        </tr>
                        <tr>
                            <td>Location verification failed</td>
                            <td>Enable location services, ensure you're physically in the classroom</td>
                        </tr>
                    </tbody>
                </table>
          </div>
        </div>



        {/* Privacy */}
        <div id="privacy" className="tab-content">
          <div className="doc-section">
            <h2>🔒 Privacy Policy</h2>
            <p><em>Last Updated: November 6, 2025</em></p>
            {/* ... privacy content ... */}

                <h3>1. Introduction</h3>
                <p>Smart Attendance and Personalized Student Planner ("we," "our," or "the Platform") is committed to protecting the privacy and security of your personal information. This Privacy Policy explains how we collect, use, store, and protect your data when you use our attendance and planning services.</p>

                <h3>2. Information We Collect</h3>
                
                <h4>2.1 Personal Information</h4>
                <ul>
                    <li>Name, student/employee ID, email address, phone number</li>
                    <li>Enrollment details (course, batch, semester)</li>
                    <li>Profile photograph for identification purposes</li>
                    <li>Academic records and attendance history</li>
                    <li>Career goals and learning preferences</li>
                </ul>

                <h4>2.2 Biometric Data</h4>
                <ul>
                    <li>Facial recognition data (stored as encrypted mathematical representations, not actual images)</li>
                    <li>Biometric templates are hashed and cannot be reverse-engineered to recreate your image</li>
                    <li>Collection occurs only with explicit consent and institutional authorization</li>
                </ul>

                <h4>2.3 Technical Data</h4>
                <ul>
                    <li>Device information (type, OS version, browser)</li>
                    <li>IP address and approximate location (for geofencing verification)</li>
                    <li>App usage statistics and interaction patterns</li>
                    <li>Login timestamps and session data</li>
                </ul>

                <h4>2.4 Behavioral Data</h4>
                <ul>
                    <li>Task completion patterns and planner interactions</li>
                    <li>Study preferences and goal progression</li>
                    <li>Engagement metrics (anonymized for analytics)</li>
                </ul>

                <h3>3. How We Use Your Information</h3>
                
                <h4>3.1 Primary Purposes</h4>
                <ul>
                    <li>Automated attendance tracking and verification</li>
                    <li>Identity authentication and fraud prevention</li>
                    <li>Personalized learning recommendations and task scheduling</li>
                    <li>Academic progress monitoring and reporting</li>
                    <li>Communication about classes, tasks, and system updates</li>
                </ul>

                <h4>3.2 Secondary Purposes</h4>
                <ul>
                    <li>Institutional compliance and regulatory reporting</li>
                    <li>System performance optimization and improvement</li>
                    <li>Research and development (only with aggregated, anonymized data)</li>
                    <li>Security monitoring and threat detection</li>
                </ul>

                <h3>4. Data Storage and Security</h3>
                
                <h4>4.1 Storage Infrastructure</h4>
                <ul>
                    <li>All data is stored on AWS cloud infrastructure with industry-standard security</li>
                    <li>Biometric data is encrypted using AES-256 encryption</li>
                    <li>Database access is restricted through role-based controls</li>
                    <li>Regular backups are maintained in geographically distributed locations</li>
                </ul>

                <h4>4.2 Security Measures</h4>
                <ul>
                    <li>SSL/TLS encryption for all data in transit</li>
                    <li>Multi-factor authentication for administrative access</li>
                    <li>Regular security audits and penetration testing</li>
                    <li>Intrusion detection and prevention systems</li>
                    <li>Employee security training and background checks</li>
                </ul>

                <h4>4.3 Data Retention</h4>
                <ul>
                    <li>Active student data: Retained during enrollment period plus 2 years</li>
                    <li>Attendance records: Retained as per institutional policy (typically 5-7 years)</li>
                    <li>Biometric data: Deleted within 30 days of account deactivation upon request</li>
                    <li>Anonymized analytics: May be retained indefinitely for research</li>
                </ul>

                <h3>5. Data Sharing and Disclosure</h3>
                
                <h4>5.1 Within Your Institution</h4>
                <p>Your attendance and academic data is shared with:</p>
                <ul>
                    <li>Assigned faculty members (attendance and progress information)</li>
                    <li>Academic advisors and counselors (with student consent)</li>
                    <li>Institutional administrators (for compliance and reporting)</li>
                    <li>Parents/guardians (if configured by institution and permitted by law)</li>
                </ul>

                <h4>5.2 Third-Party Service Providers</h4>
                <p>We may share data with trusted partners who assist our operations:</p>
                <ul>
                    <li>Cloud hosting providers (AWS)</li>
                    <li>Analytics and monitoring services (anonymized data only)</li>
                    <li>Customer support platforms</li>
                    <li>All providers are contractually bound to protect your data</li>
                </ul>

                <h4>5.3 Legal Requirements</h4>
                <p>We may disclose data when required by:</p>
                <ul>
                    <li>Valid legal process (subpoena, court order)</li>
                    <li>Government investigations or regulatory compliance</li>
                    <li>Protection of rights, safety, or property</li>
                    <li>Prevention of fraud or illegal activities</li>
                </ul>

                <div className="warning-box">
                    <strong>⚠️ Important:</strong> We will never sell your personal information to third parties for marketing purposes.
                </div>

                <h3>6. Your Privacy Rights</h3>
                
                <h4>6.1 Access and Portability</h4>
                <ul>
                    <li>View all personal data we hold about you</li>
                    <li>Download your attendance records and planner data</li>
                    <li>Request data in machine-readable format (CSV/JSON)</li>
                </ul>

                <h4>6.2 Correction and Updates</h4>
                <ul>
                    <li>Update profile information at any time</li>
                    <li>Request correction of inaccurate attendance records</li>
                    <li>Modify privacy preferences and notification settings</li>
                </ul>

                <h4>6.3 Deletion Rights</h4>
                <ul>
                    <li>Request deletion of biometric data</li>
                    <li>Deactivate account and remove personal information</li>
                    <li>Opt-out of personalized recommendations (reduces planner effectiveness)</li>
                    <li>Note: Some data may be retained for legal compliance (attendance records)</li>
                </ul>

                <h4>6.4 Consent Management</h4>
                <ul>
                    <li>Withdraw consent for biometric data collection</li>
                    <li>Opt-out of behavioral analytics</li>
                    <li>Control data sharing with parents/guardians</li>
                    <li>Manage communication preferences</li>
                </ul>

                <h3>7. GDPR and International Compliance</h3>
                <p>For users in the European Economic Area (EEA) and other regulated jurisdictions:</p>
                <ul>
                    <li>Legal basis for processing: Consent, contractual necessity, legitimate interests</li>
                    <li>Right to lodge complaints with supervisory authorities</li>
                    <li>Data transfers comply with EU-US Privacy Shield or Standard Contractual Clauses</li>
                    <li>Special protections for processing sensitive biometric data</li>
                </ul>

                <h3>8. Children's Privacy</h3>
                <p>While our platform primarily serves higher education institutions, we recognize that some users may be under 18:</p>
                <ul>
                    <li>Parental consent is obtained as required by local regulations</li>
                    <li>Enhanced privacy protections for minor students</li>
                    <li>Age-appropriate content and communications</li>
                    <li>Compliance with COPPA (Children's Online Privacy Protection Act) where applicable</li>
                </ul>

                <h3>9. Cookies and Tracking</h3>
                <p>We use cookies and similar technologies for:</p>
                <ul>
                    <li><strong>Essential cookies:</strong> Authentication, security, session management (cannot be disabled)</li>
                    <li><strong>Functional cookies:</strong> Remember preferences and settings (optional)</li>
                    <li><strong>Analytics cookies:</strong> Usage statistics and performance monitoring (optional)</li>
                    <li>You can manage cookie preferences through your browser settings</li>
                </ul>

                <h3>10. Changes to Privacy Policy</h3>
                <p>We may update this policy to reflect changes in practices or legal requirements:</p>
                <ul>
                    <li>Material changes will be notified via email and in-app announcements</li>
                    <li>Continued use after notification constitutes acceptance</li>
                    <li>Previous versions archived and available upon request</li>
                    <li>Policy version and effective date always displayed at the top</li>
                </ul>

                <h3>11. Contact Information</h3>
                <p>For privacy-related questions, concerns, or to exercise your rights:</p>
                <ul>
                    <li><strong>Data Protection Officer:</strong> privacy@smartattendance.edu</li>
                    <li><strong>Postal Address:</strong> Smart Attendance Systems, Lovely Professional University, Punjab, India</li>
                    <li><strong>Response Time:</strong> We aim to respond within 5 business days</li>
                </ul>

                <div className="info-box">
                    <strong>📞 Privacy Support:</strong> For urgent privacy concerns, contact your institutional administrator or our DPO directly at privacy@smartattendance.edu
                </div>
            </div>
        </div>

         {/* Terms of Service Tab  */}
        <div id="terms" className="tab-content">
            <div className="doc-section">
                <h2>📋 Terms of Service</h2>
                <p><em>Last Updated: November 6, 2025</em></p>

                <h3>1. Acceptance of Terms</h3>
                <p>By accessing or using the Smart Attendance and Personalized Student Planner platform ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use the Service.</p>

                <div className="warning-box">
                    <strong>⚠️ Important:</strong> These Terms constitute a legally binding agreement between you and the Service operator. Please read carefully.
                </div>

                <h3>2. Eligibility and Account Registration</h3>
                
                <h4>2.1 Eligibility</h4>
                <ul>
                    <li>You must be affiliated with a participating educational institution</li>
                    <li>Students must be enrolled in courses at the institution</li>
                    <li>Faculty and administrators must be employed by the institution</li>
                    <li>Minors (under 18) require parental/guardian consent as per institutional policy</li>
                </ul>

                <h4>2.2 Account Registration</h4>
                <ul>
                    <li>Accounts are created through institutional invitation only</li>
                    <li>You must provide accurate and complete information</li>
                    <li>One account per person; sharing credentials is prohibited</li>
                    <li>You are responsible for maintaining account security</li>
                    <li>Notify us immediately of any unauthorized access</li>
                </ul>

                <h4>2.3 Account Termination</h4>
                <ul>
                    <li>You may request account deletion at any time</li>
                    <li>Accounts may be suspended for Terms violations</li>
                    <li>Graduation/employment termination may result in account deactivation</li>
                    <li>Data retention follows our Privacy Policy after termination</li>
                </ul>

                <h3>3. Permitted Use and Restrictions</h3>
                
                <h4>3.1 Permitted Uses</h4>
                <ul>
                    <li>Mark attendance through approved methods (QR Code)</li>
                    <li>Access personal academic records and schedules</li>
                    <li>Use personalized planner for academic productivity</li>
                    <li>Generate reports and export personal data</li>
                    <li>Communicate with faculty/administrators through the platform</li>
                </ul>

                <h4>3.2 Prohibited Activities</h4>
                <ul>
                    <li><strong>Fraud:</strong> Marking attendance for others (proxy) or falsifying presence</li>
                    <li><strong>System Abuse:</strong> Attempting to bypass security measures or geofencing</li>
                    <li><strong>Unauthorized Access:</strong> Accessing others' accounts or data</li>
                    <li><strong>Reverse Engineering:</strong> Decompiling, disassembling, or modifying the application</li>
                    <li><strong>Automated Scripts:</strong> Using bots or automation tools</li>
                    <li><strong>Data Scraping:</strong> Extracting data beyond personal use</li>
                    <li><strong>Harassment:</strong> Misusing communication features</li>
                    <li><strong>Malicious Content:</strong> Uploading viruses, malware, or harmful code</li>
                </ul>

                <div className="warning-box">
                    <strong>⚠️ Academic Integrity:</strong> Attendance fraud is a serious academic offense and may result in disciplinary action by your institution, including suspension or expulsion.
                </div>

                <h3>4. Attendance Marking Policies</h3>
                
                <h4>4.1 Accuracy and Verification</h4>
                <ul>
                    <li>You must physically attend class to mark attendance</li>
                    <li>Biometric and location data must match classroom requirements</li>
                    <li>System-flagged anomalies may trigger manual review</li>
                    <li>False positives can be appealed through exception requests</li>
                </ul>

                <h4>4.2 Technical Requirements</h4>
                <ul>
                    <li>QR codes expire after time limits (typically 2 minutes)</li>
                    <li>You are responsible for maintaining device functionality</li>
                </ul>

                <h4>4.3 Manual Corrections</h4>
                <ul>
                    <li>Faculty may manually mark or correct attendance</li>
                    <li>Students can request corrections with valid justification</li>
                    <li>All manual changes are logged for audit purposes</li>
                    <li>Repeated correction requests may trigger investigation</li>
                </ul>

                <h3>5. Intellectual Property Rights</h3>
                
                <h4>5.1 Platform Ownership</h4>
                <ul>
                    <li>All platform content, features, and functionality are owned by the Service</li>
                    <li>Includes software, algorithms, designs, trademarks, and documentation</li>
                    <li>Protected by copyright, trademark, and other intellectual property laws</li>
                    <li>No rights are granted except as explicitly stated in these Terms</li>
                </ul>

                <h4>5.2 User Content</h4>
                <ul>
                    <li>You retain ownership of content you create (tasks, notes, goals)</li>
                    <li>You grant us license to use, store, and process your content for Service operation</li>
                    <li>Biometric data is processed solely for authentication purposes</li>
                    <li>We do not claim ownership of your personal academic records</li>
                </ul>

                <h4>5.3 Research and Development</h4>
                <ul>
                    <li>Anonymized, aggregated data may be used for research and system improvement</li>
                    <li>Individual identities are never disclosed in research outputs</li>
                    <li>You may opt-out of research participation while continuing Service use</li>
                </ul>

                <h3>6. Service Availability and Modifications</h3>
                
                <h4>6.1 Service Availability</h4>
                <ul>
                    <li>We strive for 99.5% uptime but cannot guarantee uninterrupted access</li>
                    <li>Scheduled maintenance will be announced in advance when possible</li>
                    <li>Emergency maintenance may occur without notice</li>
                    <li>Service interruptions do not exempt attendance obligations</li>
                </ul>

                <h4>6.2 Modifications</h4>
                <ul>
                    <li>We may update features, functionality, and interface at any time</li>
                    <li>Material changes affecting core functionality will be communicated</li>
                    <li>Continued use after modifications constitutes acceptance</li>
                    <li>We may discontinue features with reasonable notice</li>
                </ul>

                <h3>7. Institutional Policies</h3>
                
                <p>This Service operates under the authority of participating educational institutions:</p>
                <ul>
                    <li>Institutional attendance policies supersede platform defaults</li>
                    <li>Academic integrity codes apply to platform usage</li>
                    <li>Disciplinary procedures follow institutional guidelines</li>
                    <li>Data access and retention comply with institutional regulations</li>
                    <li>Disputes are subject to institutional grievance procedures</li>
                </ul>

                <h3>8. Liability and Disclaimers</h3>
                
                <h4>8.1 Service "As Is"</h4>
                <ul>
                    <li>The Service is provided "as is" without warranties of any kind</li>
                    <li>We do not guarantee error-free or uninterrupted operation</li>
                    <li>No warranty regarding accuracy, reliability, or fitness for purpose</li>
                    <li>Use at your own risk</li>
                </ul>

                <h4>8.2 Limitation of Liability</h4>
                <ul>
                    <li>We are not liable for indirect, incidental, or consequential damages</li>
                    <li>Not responsible for academic penalties due to system failures</li>
                    <li>Maximum liability limited to service fees paid (if any)</li>
                    <li>Some jurisdictions prohibit liability limitations; they may not apply to you</li>
                </ul>

                <h4>8.3 User Responsibility</h4>
                <ul>
                    <li>You are responsible for complying with attendance requirements</li>
                    <li>System failures do not excuse absence from class</li>
                    <li>Alternative attendance methods may be required during outages</li>
                    <li>Keep backup records of attendance when possible</li>
                </ul>

                <h3>9. Privacy and Data Protection</h3>
                
                <p>Your use of the Service is also governed by our Privacy Policy:</p>
                <ul>
                    <li>Data collection, use, and protection described in Privacy Policy</li>
                    <li>Biometric data processing requires explicit consent</li>
                    <li>You may exercise privacy rights as outlined in Privacy Policy</li>
                    <li>Data breaches will be reported as required by law</li>
                </ul>

                <h3>10. Indemnification</h3>
                
                <p>You agree to indemnify and hold harmless the Service, its operators, and affiliated institutions from:</p>
                <ul>
                    <li>Claims arising from your violation of these Terms</li>
                    <li>Your misuse of the Service or fraudulent activity</li>
                    <li>Your violation of any third-party rights</li>
                    <li>Any content you submit or actions you take through the platform</li>
                </ul>

                <h3>11. Dispute Resolution</h3>
                
                <h4>11.1 Governing Law</h4>
                <ul>
                    <li>These Terms are governed by the laws of India</li>
                    <li>Jurisdiction lies with courts in Punjab, India</li>
                    <li>Institutional policies may provide additional dispute mechanisms</li>
                </ul>

                <h4>11.2 Resolution Process</h4>
                <ol>
                    <li>Contact platform support: support@smartattendance.edu</li>
                    <li>Escalate to institutional administrator if unresolved</li>
                    <li>Follow institutional grievance procedures</li>
                    <li>Legal action only after exhausting above steps</li>
                </ol>

                <h3>12. Miscellaneous Provisions</h3>
                
                <h4>12.1 Entire Agreement</h4>
                <p>These Terms, together with the Privacy Policy, constitute the entire agreement between you and the Service regarding platform use.</p>

                <h4>12.2 Severability</h4>
                <p>If any provision is found unenforceable, remaining provisions continue in full effect.</p>

                <h4>12.3 Waiver</h4>
                <p>Failure to enforce any right does not constitute waiver of that right.</p>

                <h4>12.4 Assignment</h4>
                <p>You may not transfer your account or obligations. We may assign our rights to affiliated entities or successors.</p>

                <h4>12.5 Notices</h4>
                <p>Official notices will be sent to your institutional email address or displayed via in-app notifications.</p>

                <h3>13. Changes to Terms</h3>
                
                <ul>
                    <li>We may modify these Terms at any time</li>
                    <li>Material changes will be notified 30 days in advance</li>
                    <li>Continued use after effective date constitutes acceptance</li>
                    <li>If you disagree, discontinue use and request account deletion</li>
                </ul>

                <h3>14. Contact Information</h3>
                
                <p><strong>For questions about these Terms:</strong></p>
                <ul>
                <li><strong>Email:</strong> legal@smartattendance.edu</li>
                <li><strong>Support:</strong> support@smartattendance.edu</li>
                <li>
                    <strong>Address:</strong><br />
                    Smart Attendance Systems<br />
                    Department of Computer Science<br />
                    Lovely Professional University<br />
                    Punjab, India
                </li>
                </ul>
                <div className="success-box">
                    <strong>✅ Acknowledgment:</strong> By using the Smart Curriculum & Personalized System Management, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy.
                </div>
        </div>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-links">
            <a href="index.html">Home</a>
            <a href="about.html">About</a>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); openTabProgrammatic("docs"); window.scrollTo(0, 0); }}
            >
              Documentation
            </a>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); openTabProgrammatic("help"); window.scrollTo(0, 0); }}
            >
              Help
            </a>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); openTabProgrammatic("privacy"); window.scrollTo(0, 0); }}
            >
              Privacy
            </a>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); openTabProgrammatic("terms"); window.scrollTo(0, 0); }}
            >
              Terms
            </a>
          </div>
          <p style={{ marginTop: '1.5rem' }}>&copy; {new Date().getFullYear()} Attenza - Smart Curriculum & Personalized System Management. All rights reserved.</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>Developed by Bijay Kumar Mishra</p>
        </div>
      </footer>
    </div>
  );
}
