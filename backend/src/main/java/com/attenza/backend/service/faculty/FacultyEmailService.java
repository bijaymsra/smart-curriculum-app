package com.attenza.backend.service.faculty;

import com.attenza.backend.entity.Faculty;
import com.attenza.backend.entity.Institution;
import com.attenza.backend.entity.enums.FacultyStatus;
import com.attenza.backend.service.admin.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Year;

@Service
@RequiredArgsConstructor
public class FacultyEmailService {

    private final EmailService emailService; // reuse admin email infra

    /**
     * 🔐 Sent ONLY ONCE when faculty becomes ACTIVE for the first time
     * Includes Institution ID + Faculty ID + Temporary Password
     */
    public void sendFacultyActivationEmail(Faculty faculty, String temporaryPassword) {

        Institution institution = faculty.getInstitution();
        String institutionPublicId = institution != null
                ? institution.getPublicId()
                : "N/A";

        String subject = "🎉 Your Faculty Account is Activated";

        String body = """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body {
                        font-family: 'Segoe UI', Arial, sans-serif;
                        background-color: #f5f5f5;
                        padding: 20px;
                    }
                    .container {
                        max-width: 600px;
                        margin: auto;
                        background: white;
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    }
                    .header {
                        background: linear-gradient(135deg, #0ea5e9, #2563eb);
                        color: white;
                        padding: 30px;
                        text-align: center;
                    }
                    .content {
                        padding: 35px;
                        color: #1f2937;
                    }
                    .credentials {
                        background: #f8fafc;
                        border: 2px solid #2563eb;
                        border-radius: 10px;
                        padding: 20px;
                        margin: 25px 0;
                    }
                    .cred-row {
                        margin: 12px 0;
                        font-family: monospace;
                        font-size: 15px;
                    }
                    .footer {
                        text-align: center;
                        padding: 25px;
                        font-size: 14px;
                        color: #6b7280;
                        background: #f8fafc;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Faculty Account Activated</h1>
                        <p>Welcome to Attenza</p>
                    </div>

                    <div class="content">
                        <p>Dear <strong>%s</strong>,</p>

                        <p>Your faculty account has been <strong>successfully activated</strong>.</p>

                        <div class="credentials">
                            <div class="cred-row"><b>Institution ID:</b> %s</div>
                            <div class="cred-row"><b>Faculty ID:</b> %s</div>
                            <div class="cred-row"><b>Temporary Password:</b> %s</div>
                            <div class="cred-row"><b>Login URL:</b> http://localhost:3000/login</div>
                        </div>

                        <p>
                            Please log in and <strong>change your password immediately</strong>
                            for security reasons.
                        </p>
                    </div>

                    <div class="footer">
                        <p>Regards,<br/>Attenza Administration Team</p>
                        <p>© %s Attenza</p>
                    </div>
                </div>
            </body>
            </html>
            """
            .formatted(
                faculty.getFullName(),
                institutionPublicId,
                faculty.getFacultyId(),
                temporaryPassword,
                Year.now().getValue()
            );

        emailService.sendEmail(faculty.getEmail(), subject, body);
    }

    /**
     * ℹ️ Sent for ALL status changes except first activation
     */
    public void sendFacultyStatusChangeEmail(Faculty faculty,
                                             FacultyStatus oldStatus,
                                             FacultyStatus newStatus) {

        String subject = "ℹ️ Faculty Status Updated";

        String body = """
            <html>
            <body style="font-family: Arial, sans-serif; background:#f5f5f5; padding:20px;">
                <div style="max-width:600px; background:white; margin:auto; padding:30px; border-radius:10px;">
                    <h2>Faculty Status Update</h2>

                    <p>Dear <strong>%s</strong>,</p>

                    <p>Your account status has been updated.</p>

                    <p>
                        <b>Previous Status:</b> %s<br/>
                        <b>Current Status:</b> %s
                    </p>

                    <p>If you have any questions, please contact the administration.</p>

                    <br/>
                    <p>Regards,<br/>Attenza Administration Team</p>
                </div>
            </body>
            </html>
            """
            .formatted(
                faculty.getFullName(),
                oldStatus.name(),
                newStatus.name()
            );

        emailService.sendEmail(faculty.getEmail(), subject, body);
    }
}
