package com.attenza.backend.service.admin;

import com.attenza.backend.entity.AdminStatus;
import com.attenza.backend.entity.AdminUser;
import com.attenza.backend.exception.BadRequestException;
import com.attenza.backend.repository.admin.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Year;

@Service
@RequiredArgsConstructor
public class AdminApprovalService {

    private final AdminUserRepository adminRepo;
    private final EmailService emailService;

    @Transactional
    public void updateAdminStatus(Long adminId, AdminStatus newStatus) {

        AdminUser admin = adminRepo.findById(adminId)
                .orElseThrow(() -> new BadRequestException("Admin not found"));

        AdminStatus oldStatus = admin.getStatus();

        if (oldStatus == newStatus) {
            throw new BadRequestException("Admin already in status: " + newStatus);
        }

        admin.setStatus(newStatus);
        adminRepo.save(admin);

        // 📧 Send email ONLY after successful status change
        sendStatusEmail(admin, oldStatus, newStatus);
    }

    private void sendStatusEmail(AdminUser admin, AdminStatus oldStatus, AdminStatus newStatus) {

        String subject;
        String body;

        switch (newStatus) {

            case APPROVED -> {
                subject = "🎉 Your Attenza Admin Account is Approved";
                
                String template = """
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="UTF-8">
                        <style>
                            body { 
                                font-family: 'Segoe UI', Arial, sans-serif; 
                                line-height: 1.6; 
                                color: #333;
                                margin: 0;
                                padding: 0;
                                background-color: #f5f5f5;
                            }
                            .email-container {
                                max-width: 600px;
                                margin: 20px auto;
                                background: white;
                                border-radius: 12px;
                                overflow: hidden;
                                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                            }
                            .header {
                                background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
                                color: white;
                                padding: 40px 20px;
                                text-align: center;
                            }
                            .header h1 {
                                margin: 0;
                                font-size: 28px;
                            }
                            .header .subtitle {
                                opacity: 0.9;
                                margin-top: 10px;
                                font-size: 16px;
                            }
                            .content {
                                padding: 40px;
                            }
                            .greeting {
                                font-size: 20px;
                                margin-bottom: 30px;
                                color: #1f2937;
                            }
                            .welcome-box {
                                background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
                                border: 2px solid #0ea5e9;
                                border-radius: 12px;
                                padding: 30px;
                                margin: 30px 0;
                                text-align: center;
                            }
                            .welcome-title {
                                color: #0369a1;
                                font-size: 22px;
                                margin-bottom: 15px;
                            }
                            .credentials-box {
                                background: #f8fafc;
                                border: 2px solid #4F46E5;
                                border-radius: 10px;
                                padding: 25px;
                                margin: 25px 0;
                            }
                            .credential-item {
                                margin: 15px 0;
                                display: flex;
                                align-items: center;
                                gap: 15px;
                            }
                            .credential-label {
                                font-weight: 600;
                                color: #4b5563;
                                min-width: 140px;
                            }
                            .credential-value {
                                background: white;
                                padding: 10px 18px;
                                border-radius: 8px;
                                border: 1px solid #e5e7eb;
                                flex: 1;
                                font-family: 'Courier New', monospace;
                            }
                            .instructions {
                                background: #f0f9ff;
                                border-left: 4px solid #0ea5e9;
                                padding: 25px;
                                margin: 30px 0;
                                border-radius: 0 10px 10px 0;
                            }
                            .instructions-title {
                                color: #0369a1;
                                font-size: 20px;
                                margin-bottom: 15px;
                                display: flex;
                                align-items: center;
                                gap: 10px;
                            }
                            .instructions ol {
                                margin: 20px 0;
                                padding-left: 25px;
                            }
                            .instructions li {
                                margin: 12px 0;
                            }
                            .features {
                                background: #f8fafc;
                                padding: 25px;
                                border-radius: 10px;
                                margin: 25px 0;
                            }
                            .features-title {
                                color: #4F46E5;
                                font-size: 20px;
                                margin-bottom: 20px;
                            }
                            .features-grid {
                                display: grid;
                                grid-template-columns: repeat(2, 1fr);
                                gap: 15px;
                                margin-top: 15px;
                            }
                            .feature-item {
                                background: white;
                                padding: 15px;
                                border-radius: 8px;
                                border: 1px solid #e5e7eb;
                                text-align: center;
                            }
                            .feature-icon {
                                font-size: 24px;
                                margin-bottom: 8px;
                            }
                            .important-note {
                                background: #fef2f2;
                                border: 2px solid #fca5a5;
                                border-radius: 10px;
                                padding: 25px;
                                margin: 30px 0;
                            }
                            .important-title {
                                color: #dc2626;
                                font-weight: 600;
                                margin-bottom: 15px;
                                display: flex;
                                align-items: center;
                                gap: 10px;
                            }
                            .footer {
                                background: #f8fafc;
                                padding: 30px;
                                text-align: center;
                                border-top: 1px solid #eaeaea;
                            }
                            .contact-info {
                                margin-top: 25px;
                                font-size: 14px;
                                color: #6b7280;
                            }
                            .badge {
                                display: inline-block;
                                padding: 6px 15px;
                                background: #10b981;
                                color: white;
                                border-radius: 20px;
                                font-size: 14px;
                                font-weight: 600;
                                margin-left: 10px;
                            }
                            .institution-badge {
                                background: #8b5cf6;
                                color: white;
                                padding: 4px 12px;
                                border-radius: 6px;
                                font-size: 14px;
                                display: inline-block;
                                margin-left: 10px;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="email-container">
                            <div class="header">
                                <h1>🎉 Welcome to Attenza Administration</h1>
                                <div class="subtitle">Your institution admin account has been approved</div>
                            </div>
                            
                            <div class="content">
                                <div class="greeting">
                                    Dear <strong>${FULL_NAME}</strong>,
                                </div>
                                
                                <div class="welcome-box">
                                    <div class="welcome-title">✅ Account Approved Successfully</div>
                                    <p>Congratulations! Your administrator account for <strong>${INSTITUTION_NAME}</strong> has been approved and activated.</p>
                                    <div style="margin-top: 15px;">
                                        <span class="badge">ADMINISTRATOR</span>
                                        <span class="institution-badge">${INSTITUTION_NAME}</span>
                                    </div>
                                </div>
                                
                                <div class="credentials-box">
                                    <div style="text-align: center; margin-bottom: 20px; color: #4F46E5; font-size: 18px; font-weight: 600;">
                                        🔐 Your Login Credentials
                                    </div>
                                    <div class="credential-item">
                                        <span class="credential-label">📧 Login Email:</span>
                                        <span class="credential-value">${EMAIL}</span>
                                    </div>
                                    <div class="credential-item">
                                        <span class="credential-label">🏛️ Institution:</span>
                                        <span class="credential-value">${INSTITUTION_NAME}</span>
                                    </div>
                                    <div class="credential-item">
                                        <span class="credential-label">🌐 Login at Login Portal:</span>
                                    </div>
                                </div>
                                
                                <div class="instructions">
                                    <div class="instructions-title">📝 Getting Started Guide</div>
                                    <ol>
                                        <li><strong>Select</strong> "Admin / Faculty" as login type</li>
                                        <li><strong>Enter</strong> your registered email address</li>
                                        <li><strong>Enter</strong> your password (use "Forgot Password" if needed)</li>
                                        <li><strong>Explore</strong> the admin dashboard features</li>
                                    </ol>
                                </div>
                                
                                <div class="features">
                                    <div class="features-title">🚀 Available Admin Features</div>
                                    <div class="features-grid">
                                        <div class="feature-item">
                                            <div class="feature-icon">👨‍🎓</div>
                                            <div><strong>Student Management</strong></div>
                                            <div style="font-size: 12px; color: #6b7280; margin-top: 5px;">Add, view, and manage students</div>
                                        </div>
                                        <div class="feature-item">
                                            <div class="feature-icon">📊</div>
                                            <div><strong>Attendance Tracking</strong></div>
                                            <div style="font-size: 12px; color: #6b7280; margin-top: 5px;">Monitor and manage attendance</div>
                                        </div>
                                        <div class="feature-item">
                                            <div class="feature-icon">📈</div>
                                            <div><strong>Analytics Dashboard</strong></div>
                                            <div style="font-size: 12px; color: #6b7280; margin-top: 5px;">View institution insights</div>
                                        </div>
                                        <div class="feature-item">
                                            <div class="feature-icon">⚙️</div>
                                            <div><strong>System Settings</strong></div>
                                            <div style="font-size: 12px; color: #6b7280; margin-top: 5px;">Configure institution settings</div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="important-note">
                                    <div class="important-title">⚠️ Important Security Notes</div>
                                    <ul style="margin: 15px 0; padding-left: 20px;">
                                        <li>Keep your login credentials confidential</li>
                                        <li>Change your password regularly</li>
                                        <li>Enable two-factor authentication if available</li>
                                        <li>Contact support immediately for suspicious activity</li>
                                    </ul>
                                </div>
                                
                                <p style="text-align: center; color: #6b7280; font-style: italic;">
                                    "Empowering educational institutions with intelligent attendance management"
                                </p>
                            </div>
                            
                            <div class="footer">
                                <p style="font-size: 18px; font-weight: 600; color: #4F46E5;">Best regards,</p>
                                <p style="font-size: 16px; margin: 10px 0;">Attenza Administration Team</p>
                                <div class="contact-info">
                                    <p>Need help? Contact our support team: support@attenza.edu</p>
                                    <p>Documentation: <a href="http://docs.attenza.edu">docs.attenza.edu</a></p>
                                    <p>© ${YEAR} Attenza. All rights reserved.</p>
                                </div>
                            </div>
                        </div>
                    </body>
                    </html>
                    """;
                
                String institutionName = admin.getInstitution() != null ? admin.getInstitution().getName() : "Your Institution";
                
                body = template
                    .replace("${FULL_NAME}", admin.getFullName())
                    .replace("${INSTITUTION_NAME}", institutionName)
                    .replace("${EMAIL}", admin.getEmail())
                    .replace("${YEAR}", String.valueOf(Year.now().getValue()));
            }

            case DECLINED -> {
                subject = "Update on Your Attenza Admin Request";
                
                String template = """
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="UTF-8">
                        <style>
                            body { 
                                font-family: 'Segoe UI', Arial, sans-serif; 
                                line-height: 1.6; 
                                color: #333;
                                margin: 0;
                                padding: 0;
                                background-color: #f5f5f5;
                            }
                            .email-container {
                                max-width: 600px;
                                margin: 20px auto;
                                background: white;
                                border-radius: 12px;
                                overflow: hidden;
                                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                            }
                            .header {
                                background: linear-gradient(135deg, #6b7280 0%, #9ca3af 100%);
                                color: white;
                                padding: 40px 20px;
                                text-align: center;
                            }
                            .header h1 {
                                margin: 0;
                                font-size: 28px;
                            }
                            .content {
                                padding: 40px;
                            }
                            .greeting {
                                font-size: 20px;
                                margin-bottom: 30px;
                                color: #1f2937;
                            }
                            .update-box {
                                background: #f8fafc;
                                border: 2px solid #9ca3af;
                                border-radius: 12px;
                                padding: 30px;
                                margin: 30px 0;
                                text-align: center;
                            }
                            .update-title {
                                color: #6b7280;
                                font-size: 22px;
                                margin-bottom: 15px;
                            }
                            .reason-box {
                                background: #fef2f2;
                                border: 2px solid #fca5a5;
                                border-radius: 10px;
                                padding: 25px;
                                margin: 25px 0;
                            }
                            .reason-title {
                                color: #dc2626;
                                font-size: 18px;
                                margin-bottom: 15px;
                                display: flex;
                                align-items: center;
                                gap: 10px;
                            }
                            .next-steps {
                                background: #f0f9ff;
                                border-left: 4px solid #0ea5e9;
                                padding: 25px;
                                margin: 30px 0;
                                border-radius: 0 10px 10px 0;
                            }
                            .steps-title {
                                color: #0369a1;
                                font-size: 20px;
                                margin-bottom: 15px;
                            }
                            .contact-info {
                                background: #f8fafc;
                                padding: 25px;
                                border-radius: 10px;
                                margin: 25px 0;
                                text-align: center;
                            }
                            .footer {
                                background: #f8fafc;
                                padding: 30px;
                                text-align: center;
                                border-top: 1px solid #eaeaea;
                            }
                            .support-contact {
                                margin-top: 25px;
                                font-size: 14px;
                                color: #6b7280;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="email-container">
                            <div class="header">
                                <h1>📋 Update on Your Admin Request</h1>
                                <div style="opacity: 0.9; margin-top: 10px; font-size: 16px;">
                                    Attenza Institution Administration
                                </div>
                            </div>
                            
                            <div class="content">
                                <div class="greeting">
                                    Dear <strong>${FULL_NAME}</strong>,
                                </div>
                                
                                <div class="update-box">
                                    <div class="update-title">ℹ️ Request Status Update</div>
                                    <p>We regret to inform you that your request for an administrator account has been <strong style="color: #dc2626;">declined</strong>.</p>
                                </div>
                                
                                <div class="reason-box">
                                    <div class="reason-title">📋 Possible Reasons</div>
                                    <ul style="margin: 15px 0; padding-left: 20px;">
                                        <li>Incomplete institution verification</li>
                                        <li>Documentation requirements not met</li>
                                        <li>Existing admin account for the institution</li>
                                        <li>Verification process issues</li>
                                    </ul>
                                </div>
                                
                                <div class="next-steps">
                                    <div class="steps-title">🔄 Next Steps & Appeal Process</div>
                                    <ol style="margin: 20px 0; padding-left: 25px;">
                                        <li><strong>Review</strong> your submitted information for accuracy</li>
                                        <li><strong>Contact</strong> our support team for specific reasons</li>
                                        <li><strong>Resubmit</strong> your application with complete documentation</li>
                                        <li><strong>Verify</strong> your institution details are correct</li>
                                    </ol>
                                </div>
                                
                                <div class="contact-info">
                                    <p style="color: #4F46E5; font-size: 18px; font-weight: 600;">📞 Need Assistance?</p>
                                    <p>Our support team is available to help you understand the decision and guide you through the reapplication process.</p>
                                    <p style="margin-top: 15px;">
                                        <strong>Support Email:</strong> support@attenza.edu<br>
                                        <strong>Support Hours:</strong> Mon-Fri, 9AM-6PM
                                    </p>
                                </div>
                                
                                <p style="text-align: center; color: #6b7280; font-style: italic;">
                                    We appreciate your interest in joining the Attenza platform and encourage you to reapply with complete information.
                                </p>
                            </div>
                            
                            <div class="footer">
                                <p style="font-size: 16px; color: #6b7280;">Sincerely,</p>
                                <p style="font-size: 18px; font-weight: 600; margin: 10px 0;">Attenza Review Committee</p>
                                <div class="support-contact">
                                    <p>For appeals: appeals@attenza.edu</p>
                                    <p>© ${YEAR} Attenza. All rights reserved.</p>
                                </div>
                            </div>
                        </div>
                    </body>
                    </html>
                    """;
                
                body = template
                    .replace("${FULL_NAME}", admin.getFullName())
                    .replace("${YEAR}", String.valueOf(Year.now().getValue()));
            }



            default -> {
                return; // no email for PENDING
            }
        }

        emailService.sendEmail(admin.getEmail(), subject, body);
    }
}