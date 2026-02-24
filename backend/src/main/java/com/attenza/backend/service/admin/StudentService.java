package com.attenza.backend.service.admin;

import com.attenza.backend.dto.student.StudentResponse;
import com.attenza.backend.dto.student.StudentStatsResponse;
import com.attenza.backend.dto.student.UpdateStudentStatusRequest;
import com.attenza.backend.entity.AdminUser;
import com.attenza.backend.entity.Student;
import com.attenza.backend.entity.StudentStatus;
import com.attenza.backend.repository.admin.AdminUserRepository;
import com.attenza.backend.repository.admin.StudentRepository;
import com.attenza.backend.util.IdGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.attenza.backend.timetable.service.StudentGroupService;
import com.attenza.backend.repository.faculty.DepartmentRepository;
import com.attenza.backend.entity.Department;
import com.attenza.backend.exception.BadRequestException;




import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final AdminUserRepository adminUserRepository;
    private final IdGenerator idGenerator;
    private final EmailService emailService;
    private final BCryptPasswordEncoder passwordEncoder;
    private final StudentGroupService studentGroupService;
    private final DepartmentRepository departmentRepository;

        private String escapeForFormat(String input) {
            if (input == null) {
                return "";
            }
        return input
            .replace("%", "%%")
            .replace("\\n", "\\\\n") 
            .replace("\\t", "\\\\t"); 
        }

    public List<StudentResponse> getStudentsForAdmin(Long adminId) {

        AdminUser admin = adminUserRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        Long institutionId = admin.getInstitution().getId();

        return studentRepository.findByInstitution_Id(institutionId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public StudentResponse getStudentById(Long studentId, Long adminId) {

        AdminUser admin = adminUserRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if (!student.getInstitution().getId()
                .equals(admin.getInstitution().getId())) {
            throw new RuntimeException("Unauthorized access to student");
        }

        return toResponse(student);
    }

    public StudentStatsResponse getStats(Long adminId) {
        AdminUser admin = adminUserRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        Long institutionId = admin.getInstitution().getId();
        return getStudentStats(institutionId);
    }

public StudentStatsResponse getStudentStats(Long institutionId) {
    long total = studentRepository.countByInstitution_Id(institutionId);
    
    long active = studentRepository.countByInstitution_IdAndStatus(
        institutionId, StudentStatus.ACTIVE);
    
    long warning = studentRepository.countByInstitution_IdAndStatus(
        institutionId, StudentStatus.WARNING);
    
    long suspended = studentRepository.countByInstitution_IdAndStatus(
        institutionId, StudentStatus.SUSPENDED);
    
    Double avgAttendanceDb = studentRepository.findAverageAttendanceByInstitutionId(institutionId);
    double avgAttendance = avgAttendanceDb != null ? avgAttendanceDb : 0.0;
    
    return new StudentStatsResponse(total, active, warning, suspended, avgAttendance);
}

        public StudentResponse createStudent(Student student, Long adminId) {

            AdminUser admin = adminUserRepository.findById(adminId)
                    .orElseThrow(() -> new RuntimeException("Admin not found"));

            String regNo = idGenerator.generateStudentRegistrationNo(
                    admin.getInstitution().getId()
            );

            student.setRegistrationNo(regNo);
            student.setPublicId(idGenerator.generatePublicStudentId(regNo));
            student.setInstitution(admin.getInstitution());

            
            student.setStatus(StudentStatus.PENDING);
            student.setAttendancePercentage(0);

            Student saved = studentRepository.save(student);
            return toResponse(saved);
        }

    @Transactional
    public StudentResponse updateStudentStatus(
            Long studentId,
            Long adminId,
            UpdateStudentStatusRequest request
    ) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        StudentStatus current = student.getStatus();
        StudentStatus target = request.status();
        if (current == target) {
            return toResponse(student);
        }

        switch (current) {

            case PENDING -> handlePendingTransition(student, target, request.reason());

            case ACTIVE, WARNING -> handleActiveTransition(student, target, request.reason());

            case SUSPENDED -> handleSuspendedTransition(student, target, request.reason());

            default -> throw new RuntimeException("Invalid status transition");
        }

        if (current != StudentStatus.ACTIVE && target == StudentStatus.ACTIVE) {

            Department department = departmentRepository
                .findByInstitutionIdAndDepartmentCode(
                    student.getInstitution().getId(),
                    student.getDepartment()
                )
                .orElseThrow(() -> new BadRequestException("Department not found"));

            studentGroupService.findOrCreateGroupFromStudent(
                student.getInstitution(),
                department,
                student.getCourse(),
                student.getBatch(),
                student.getSemester(),
                student.getSection()
            );
        }

        student.setStatus(target);
        studentRepository.save(student);

        return toResponse(student);
    }


private void handlePendingTransition(Student student,
                                     StudentStatus target,
                                     String reason) {
    String fullName = escapeForFormat(student.getFullName());
    String regNo = escapeForFormat(student.getRegistrationNo());
    String instName = escapeForFormat(student.getInstitution().getName());
    String publicId = escapeForFormat(student.getInstitution().getPublicId());
    int currentYear = java.time.Year.now().getValue();
    
    switch (target) {
        case ACTIVE -> {
            if (student.getPasswordHash() == null) {
                String rawPassword = generatePassword();
                student.setPasswordHash(passwordEncoder.encode(rawPassword));
                
                emailService.sendEmail(
                    student.getEmail(),
                    "Your Student Account is Approved",
                    buildApprovalEmail(student, rawPassword)
                );
            } else {
                String emailContent = String.format("""
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="UTF-8">
                        <style>
                            body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
                            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
                            .header { background: linear-gradient(135deg, #10b981 0%%, #34d399 100%%); color: white; padding: 30px 20px; text-align: center; }
                            .content { padding: 40px; }
                            .greeting { font-size: 18px; margin-bottom: 25px; }
                            .info-box { background: #f0f9ff; border: 2px solid #0ea5e9; border-radius: 10px; padding: 25px; margin: 25px 0; }
                            .footer { background: #f8fafc; padding: 25px; text-align: center; border-top: 1px solid #eaeaea; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1>🔄 Account Reactivated</h1>
                            </div>
                            <div class="content">
                                <div class="greeting">Dear <strong>%s</strong>,</div>
                                <p>Your student account has been approved and reactivated.</p>
                                
                                <div class="info-box">
                                    <p><strong>📋 Account Details:</strong></p>
                                    <p>• Status: <strong style="color: #10b981;">ACTIVE</strong></p>
                                    <p>• Institution: %s</p>
                                    <p>• Registration No: %s</p>
                                </div>
                                
                                <p><strong>🔐 Login Instructions:</strong></p>
                                <ol>
                                    <li>Use your existing credentials to log in</li>
                                    <li>Institution Code: %s</li>
                                    <li>Username: %s</li>
                                </ol>
                                
                                <p>You may now access all student portal features.</p>
                            </div>
                            <div class="footer">
                                <p><strong>Best regards,</strong><br>Attenza Administration Team</p>
                                <p>© %d Attenza. All rights reserved.</p>
                            </div>
                        </div>
                    </body>
                    </html>
                    """,
                    fullName,
                    instName,
                    regNo,
                    publicId,
                    regNo,
                    currentYear
                );
                
                emailService.sendEmail(
                    student.getEmail(),
                    "Account Status Updated",
                    emailContent
                );
            }
        }

        case SUSPENDED, REJECTED -> {
            emailService.sendEmail(
                student.getEmail(),
                "Student Application Update",
                buildSuspensionEmail(student, reason)
            );
        }

        case WARNING -> {
            String emailContent = String.format("""
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
                        .header { background: linear-gradient(135deg, #f59e0b 0%%, #fbbf24 100%%); color: white; padding: 30px 20px; text-align: center; }
                        .content { padding: 40px; }
                        .greeting { font-size: 18px; margin-bottom: 25px; }
                        .warning-box { background: #fffbeb; border: 2px solid #f59e0b; border-radius: 10px; padding: 25px; margin: 25px 0; }
                        .important { color: #d97706; font-weight: 600; }
                        .footer { background: #f8fafc; padding: 25px; text-align: center; border-top: 1px solid #eaeaea; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>⚠️ Account Status: Warning</h1>
                        </div>
                        <div class="content">
                            <div class="greeting">Dear <strong>%s</strong>,</div>
                            
                            <div class="warning-box">
                                <p class="important">⚠️ Important Status Update</p>
                                <p>Your student account status has been changed to <strong>WARNING</strong> during the review process.</p>
                            </div>
                            
                            <p><strong>📝 Account Details:</strong></p>
                            <ul>
                                <li>Status: <strong style="color: #d97706;">WARNING</strong></li>
                                <li>Institution: %s</li>
                                <li>Registration No: %s</li>
                            </ul>
                            
                            <p><strong>📞 Contact:</strong> Please contact your institution administration for more details about this status change.</p>
                        </div>
                        <div class="footer">
                            <p><strong>Regards,</strong><br>Administrative Committee<br>%s</p>
                            <p>© %d Attenza. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
                """,
                fullName,
                instName,
                regNo,
                instName,
                currentYear
            );
            
            emailService.sendEmail(
                student.getEmail(),
                "Account Status Changed to Warning",
                emailContent
            );
        }

        case PENDING -> {
            System.out.println("Student " + student.getId() + " already PENDING, no action needed.");
        }

        default -> throw new RuntimeException("Invalid transition from PENDING to " + target);
    }
}

private void handleActiveTransition(
        Student student,
        StudentStatus target,
        String reason
) {
    String fullName = escapeForFormat(student.getFullName());
    String regNo = escapeForFormat(student.getRegistrationNo());
    String instName = escapeForFormat(student.getInstitution().getName());
    String emailDomain = escapeForFormat(student.getInstitution().getName().toLowerCase().replaceAll("\\s+", ""));
    // String safeReason = escapeForFormat(reason);
    int currentYear = java.time.Year.now().getValue();
    
    switch (target) {
        case WARNING -> {
            String emailContent = String.format("""
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
                            background: linear-gradient(135deg, #f59e0b 0%%, #fbbf24 100%%);
                            color: white;
                            padding: 30px 20px;
                            text-align: center;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 24px;
                        }
                        .content {
                            padding: 40px;
                        }
                        .greeting {
                            font-size: 18px;
                            margin-bottom: 25px;
                        }
                        .warning-box {
                            background: #fffbeb;
                            border: 2px solid #f59e0b;
                            border-radius: 10px;
                            padding: 25px;
                            margin: 25px 0;
                        }
                        .warning-title {
                            color: #d97706;
                            font-size: 20px;
                            margin-bottom: 15px;
                            display: flex;
                            align-items: center;
                            gap: 10px;
                        }
                        .student-info {
                            background: #f8fafc;
                            padding: 20px;
                            border-radius: 8px;
                            margin: 20px 0;
                        }
                        .info-item {
                            margin: 10px 0;
                            display: flex;
                        }
                        .info-label {
                            font-weight: 600;
                            color: #4b5563;
                            min-width: 160px;
                        }
                        .actions-box {
                            background: #f0f9ff;
                            border-left: 4px solid #0ea5e9;
                            padding: 20px;
                            margin: 25px 0;
                            border-radius: 0 8px 8px 0;
                        }
                        .actions-title {
                            color: #0369a1;
                            font-size: 18px;
                            margin-bottom: 15px;
                        }
                        .actions-list {
                            margin: 15px 0;
                            padding-left: 25px;
                        }
                        .actions-list li {
                            margin: 8px 0;
                        }
                        .deadline {
                            background: #fef2f2;
                            border: 2px solid #fca5a5;
                            border-radius: 8px;
                            padding: 20px;
                            margin: 25px 0;
                            text-align: center;
                        }
                        .deadline-title {
                            color: #dc2626;
                            font-weight: 600;
                            margin-bottom: 10px;
                        }
                        .footer {
                            background: #f8fafc;
                            padding: 25px;
                            text-align: center;
                            border-top: 1px solid #eaeaea;
                        }
                        .contact-info {
                            margin-top: 20px;
                            font-size: 14px;
                            color: #6b7280;
                        }
                    </style>
                </head>
                <body>
                    <div class="email-container">
                        <div class="header">
                            <h1>⚠️ Attendance Warning Notice</h1>
                        </div>
                        
                        <div class="content">
                            <div class="greeting">
                                Dear <strong>%s</strong>,
                            </div>
                            
                            <div class="warning-box">
                                <div class="warning-title">
                                    ⚠️ Important: Attendance Below Required Standards
                                </div>
                                <p>This email serves as an official warning regarding your attendance percentage which has fallen below the institution's required standards.</p>
                            </div>
                            
                            <div class="student-info">
                                <div class="info-item">
                                    <span class="info-label">Student Name:</span>
                                    <span>%s</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Registration No:</span>
                                    <span>%s</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Institution:</span>
                                    <span>%s</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Current Status:</span>
                                    <span style="color: #d97706; font-weight: 600;">WARNING</span>
                                </div>
                            </div>
                            
                            <div class="actions-box">
                                <div class="actions-title">📋 Required Actions</div>
                                <ul class="actions-list">
                                    <li><strong>Review</strong> your attendance records on the student portal</li>
                                    <li><strong>Contact</strong> your course coordinator to discuss improvement</li>
                                    <li><strong>Attend</strong> all scheduled classes regularly</li>
                                    <li><strong>Submit</strong> any pending assignments or requirements</li>
                                    <li><strong>Meet</strong> with your academic advisor if available</li>
                                </ul>
                            </div>
                            
                            <div class="deadline">
                                <div class="deadline-title">⏰ Immediate Attention Required</div>
                                <p>Please take corrective action immediately to avoid further academic consequences, including possible suspension.</p>
                            </div>
                            
                            <p><strong>Next Steps:</strong> Your attendance will be monitored over the next 2 weeks. If improvement is not observed, further disciplinary action may be taken.</p>
                        </div>
                        
                        <div class="footer">
                            <p><strong>Regards,</strong><br>Academic Administration<br>%s</p>
                            <div class="contact-info">
                                <p>For queries, contact: admin@%s.edu</p>
                                <p>© %d Attenza. All rights reserved.</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
                """,
                fullName,
                fullName,
                regNo,
                instName,
                instName,
                emailDomain,
                currentYear
            );
            
            emailService.sendEmail(
                student.getEmail(),
                "Attendance Warning",
                emailContent
            );
        }

        case ACTIVE -> {
            String emailContent = String.format("""
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
                        .header { background: linear-gradient(135deg, #10b981 0%%, #34d399 100%%); color: white; padding: 30px 20px; text-align: center; }
                        .content { padding: 40px; }
                        .greeting { font-size: 18px; margin-bottom: 25px; }
                        .success-box { background: #f0f9ff; border: 2px solid #0ea5e9; border-radius: 10px; padding: 25px; margin: 25px 0; text-align: center; }
                        .footer { background: #f8fafc; padding: 25px; text-align: center; border-top: 1px solid #eaeaea; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>✅ Warning Status Cleared</h1>
                        </div>
                        <div class="content">
                            <div class="greeting">Dear <strong>%s</strong>,</div>
                            
                            <div class="success-box">
                                <p style="font-size: 20px; font-weight: 600; color: #10b981;">🎉 Excellent Progress!</p>
                                <p>Your warning status has been <strong>cleared</strong> and your account is now fully <strong style="color: #10b981;">ACTIVE</strong>.</p>
                            </div>
                            
                            <p><strong>📈 Your Improvement:</strong></p>
                            <p>We have noted your improved academic performance and regular attendance. Keep up the good work!</p>
                            
                            <p><strong>📝 Current Status:</strong></p>
                            <ul>
                                <li>Account Status: <strong style="color: #10b981;">ACTIVE</strong></li>
                                <li>Institution: %s</li>
                                <li>Registration No: %s</li>
                                <li>No restrictions on your account</li>
                            </ul>
                            
                            <p>Continue maintaining the high standards you've demonstrated.</p>
                        </div>
                        <div class="footer">
                            <p><strong>Congratulations and best regards,</strong><br>Academic Administration Team<br>%s</p>
                            <p>© %d Attenza. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
                """,
                fullName,
                instName,
                regNo,
                instName,
                currentYear
            );
            
            emailService.sendEmail(
                student.getEmail(),
                "Status Update - Warning Cleared",
                emailContent
            );
        }

        case SUSPENDED -> emailService.sendEmail(
                student.getEmail(),
                "Account Suspended",
                buildSuspensionEmail(student, reason)
        );

        case PENDING -> {
            String emailContent = String.format("""
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
                        .header { background: linear-gradient(135deg, #f59e0b 0%%, #fbbf24 100%%); color: white; padding: 30px 20px; text-align: center; }
                        .content { padding: 40px; }
                        .greeting { font-size: 18px; margin-bottom: 25px; }
                        .review-box { background: #fffbeb; border: 2px solid #f59e0b; border-radius: 10px; padding: 25px; margin: 25px 0; }
                        .important { color: #d97706; font-weight: 600; }
                        .footer { background: #f8fafc; padding: 25px; text-align: center; border-top: 1px solid #eaeaea; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>📋 Account Under Administrative Review</h1>
                        </div>
                        <div class="content">
                            <div class="greeting">Dear <strong>%s</strong>,</div>
                            
                            <div class="review-box">
                                <p class="important">⚠️ Important Notice</p>
                                <p>Your student account has been temporarily moved to <strong>PENDING</strong> status for administrative review.</p>
                            </div>
                            
                            <p><strong>📝 What This Means:</strong></p>
                            <ul>
                                <li>Your account access is temporarily restricted</li>
                                <li>You cannot access course materials or submit assignments</li>
                                <li>Your attendance records are frozen</li>
                                <li>You will be notified once the review is complete</li>
                            </ul>
                            
                            <p><strong>⏳ Next Steps:</strong></p>
                            <ol>
                                <li>Wait for the administrative review to complete</li>
                                <li>You will receive a notification email with the outcome</li>
                                <li>If required, you may be contacted for additional information</li>
                            </ol>
                            
                            <p><strong>📞 Contact:</strong> If you have questions, please contact your institution administration.</p>
                        </div>
                        <div class="footer">
                            <p><strong>Regards,</strong><br>Administrative Review Committee<br>%s</p>
                            <p>© %d Attenza. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
                """,
                fullName,
                instName,
                currentYear
            );
            
            emailService.sendEmail(
                student.getEmail(),
                "Account Under Review",
                emailContent
            );
        }

        default -> throw new RuntimeException(
                "Invalid transition from ACTIVE/WARNING to " + target
        );
    }
}


private void handleSuspendedTransition(
        Student student,
        StudentStatus target,
        String reason
) {
    String fullName = escapeForFormat(student.getFullName());
    String regNo = escapeForFormat(student.getRegistrationNo());
    String instName = escapeForFormat(student.getInstitution().getName());
    String publicId = escapeForFormat(student.getInstitution().getPublicId());
    int currentYear = java.time.Year.now().getValue();
    
    switch (target) {
        case ACTIVE -> {
            String emailContent = String.format("""
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
                        .header { background: linear-gradient(135deg, #10b981 0%%, #34d399 100%%); color: white; padding: 30px 20px; text-align: center; }
                        .content { padding: 40px; }
                        .greeting { font-size: 18px; margin-bottom: 25px; }
                        .reactivation-box { background: #f0f9ff; border: 2px solid #0ea5e9; border-radius: 10px; padding: 25px; margin: 25px 0; text-align: center; }
                        .credentials-box { background: #f8fafc; border: 2px dashed #4F46E5; border-radius: 8px; padding: 20px; margin: 20px 0; }
                        .footer { background: #f8fafc; padding: 25px; text-align: center; border-top: 1px solid #eaeaea; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>✅ Account Reactivated Successfully</h1>
                        </div>
                        <div class="content">
                            <div class="greeting">Dear <strong>%s</strong>,</div>
                            
                            <div class="reactivation-box">
                                <p style="font-size: 20px; font-weight: 600; color: #10b981;">🎉 Welcome Back!</p>
                                <p>Your student account has been reactivated and you now have full access to the Attenza Student Portal.</p>
                            </div>
                            
                            <div class="credentials-box">
                                <p><strong>🔐 Your Login Information:</strong></p>
                                <p>• Institution Code: <strong>%s</strong></p>
                                <p>• Registration No: <strong>%s</strong></p>
                                <p>• Use your existing password</p>
                            </div>
                            
                            <p><strong>📝 Important Notes:</strong></p>
                            <ul>
                                <li>Use your <strong>existing password</strong> to log in</li>
                                <li>If you've forgotten your password, use the "Forgot Password" option</li>
                                <li>All your previous data and records are restored</li>
                                <li>You can resume your academic activities immediately</li>
                            </ul>
                        </div>
                        <div class="footer">
                            <p><strong>Best regards,</strong><br>Attenza Administration Team</p>
                            <p>© %d Attenza. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
                """,
                fullName,
                publicId,
                regNo,
                currentYear
            );
            
            emailService.sendEmail(
                student.getEmail(),
                "Account Reactivated",
                emailContent
            );
        }

        case WARNING -> {
            String emailContent = String.format("""
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
                        .header { background: linear-gradient(135deg, #f59e0b 0%%, #fbbf24 100%%); color: white; padding: 30px 20px; text-align: center; }
                        .content { padding: 40px; }
                        .greeting { font-size: 18px; margin-bottom: 25px; }
                        .warning-box { background: #fffbeb; border: 2px solid #f59e0b; border-radius: 10px; padding: 25px; margin: 25px 0; }
                        .credentials-box { background: #f8fafc; border: 2px dashed #4F46E5; border-radius: 8px; padding: 20px; margin: 20px 0; }
                        .footer { background: #f8fafc; padding: 25px; text-align: center; border-top: 1px solid #eaeaea; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>⚠️ Account Reactivated with Warning Status</h1>
                        </div>
                        <div class="content">
                            <div class="greeting">Dear <strong>%s</strong>,</div>
                            
                            <div class="warning-box">
                                <p>Your account has been reactivated with a <strong style="color: #d97706;">WARNING</strong> status.</p>
                                <p>Please maintain required academic standards to avoid further action.</p>
                            </div>
                            
                            <div class="credentials-box">
                                <p><strong>🔐 Login Information:</strong></p>
                                <p>• Institution Code: <strong>%s</strong></p>
                                <p>• Registration No: <strong>%s</strong></p>
                                <p>• Use your existing password</p>
                            </div>
                            
                            <p><strong>📋 Important:</strong></p>
                            <ul>
                                <li>Your account access is restored but under monitoring</li>
                                <li>Ensure regular attendance and timely submissions</li>
                                <li>Meet with your academic advisor if required</li>
                                <li>Failure to maintain standards may lead to suspension</li>
                            </ul>
                        </div>
                        <div class="footer">
                            <p><strong>Regards,</strong><br>Academic Administration<br>%s</p>
                            <p>© %d Attenza. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
                """,
                fullName,
                publicId,
                regNo,
                instName,
                currentYear
            );
            
            emailService.sendEmail(
                student.getEmail(),
                "Account Status Updated",
                emailContent
            );
        }


case PENDING -> {
    String emailContent = String.format("""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
                .header { background: linear-gradient(135deg, #f59e0b 0%%, #fbbf24 100%%); color: white; padding: 30px 20px; text-align: center; }
                .content { padding: 40px; }
                .greeting { font-size: 18px; margin-bottom: 25px; }
                .review-box { background: #fffbeb; border: 2px solid #f59e0b; border-radius: 10px; padding: 25px; margin: 25px 0; }
                .important { color: #d97706; font-weight: 600; }
                .footer { background: #f8fafc; padding: 25px; text-align: center; border-top: 1px solid #eaeaea; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>📋 Account Moved to Administrative Review</h1>
                </div>
                <div class="content">
                    <div class="greeting">Dear <strong>%s</strong>,</div>
                    
                    <div class="review-box">
                        <p class="important">⚠️ Status Change Notice</p>
                        <p>Your suspended student account has been moved to <strong>PENDING</strong> status for administrative review.</p>
                    </div>
                    
                    <p><strong>📝 What This Means:</strong></p>
                    <ul>
                        <li>Your account remains restricted during the review</li>
                        <li>You cannot access course materials or submit assignments</li>
                        <li>The suspension is temporarily lifted pending review</li>
                        <li>You will be notified once the review is complete</li>
                    </ul>
                    
                    <p><strong>⏳ Next Steps:</strong></p>
                    <ol>
                        <li>Wait for the administrative review to complete</li>
                        <li>You will receive a notification email with the outcome</li>
                        <li>If required, you may be contacted for additional information</li>
                    </ol>
                    
                    <p><strong>📞 Contact:</strong> If you have questions, please contact your institution administration.</p>
                </div>
                <div class="footer">
                    <p><strong>Regards,</strong><br>Administrative Review Committee<br>%s</p>
                    <p>© %d Attenza. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """,
        fullName,
        instName,
        currentYear
    );
    
    emailService.sendEmail(
        student.getEmail(),
        "Account Status Changed to Pending Review",
        emailContent
    );
}

        default -> throw new RuntimeException(
                "Invalid transition from SUSPENDED to " + target
        );
    }
}

    private String generatePassword() {
        return UUID.randomUUID().toString().substring(0, 10);
    }


        private String buildApprovalEmail(Student s, String password) {
            String fullName = escapeForFormat(s.getFullName());
            String regNo = escapeForFormat(s.getRegistrationNo());
            String instName = escapeForFormat(s.getInstitution().getName());
            String publicId = escapeForFormat(s.getInstitution().getPublicId());
            int currentYear = java.time.Year.now().getValue();
            
            return String.format("""
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
                            background: linear-gradient(135deg, #4F46E5 0%%, #7C3AED 100%%);
                            color: white;
                            padding: 30px 20px;
                            text-align: center;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 24px;
                        }
                        .header .subtitle {
                            opacity: 0.9;
                            margin-top: 8px;
                        }
                        .content {
                            padding: 40px;
                        }
                        .greeting {
                            font-size: 18px;
                            margin-bottom: 30px;
                        }
                        .section {
                            margin-bottom: 30px;
                            padding-bottom: 25px;
                            border-bottom: 1px solid #eaeaea;
                        }
                        .section-title {
                            color: #4F46E5;
                            font-size: 18px;
                            margin-bottom: 15px;
                            display: flex;
                            align-items: center;
                            gap: 10px;
                        }
                        .credentials-box {
                            background: #f8fafc;
                            border: 2px dashed #4F46E5;
                            border-radius: 10px;
                            padding: 25px;
                            margin: 20px 0;
                        }
                        .credential-item {
                            margin: 12px 0;
                            display: flex;
                            align-items: center;
                            gap: 12px;
                        }
                        .credential-label {
                            font-weight: 600;
                            color: #4b5563;
                            min-width: 180px;
                        }
                        .credential-value {
                            background: white;
                            padding: 8px 16px;
                            border-radius: 6px;
                            border: 1px solid #e5e7eb;
                            font-family: 'Courier New', monospace;
                            flex: 1;
                        }
                        .instructions {
                            background: #f0f9ff;
                            border-left: 4px solid #0ea5e9;
                            padding: 20px;
                            margin: 25px 0;
                            border-radius: 0 8px 8px 0;
                        }
                        .instructions ol {
                            margin: 15px 0;
                            padding-left: 25px;
                        }
                        .instructions li {
                            margin: 10px 0;
                        }
                        .important-note {
                            background: #fef2f2;
                            border: 2px solid #fca5a5;
                            border-radius: 8px;
                            padding: 20px;
                            margin: 25px 0;
                        }
                        .important-title {
                            color: #dc2626;
                            font-weight: 600;
                            margin-bottom: 10px;
                            display: flex;
                            align-items: center;
                            gap: 8px;
                        }
                        .footer {
                            background: #f8fafc;
                            padding: 25px;
                            text-align: center;
                            border-top: 1px solid #eaeaea;
                        }
                        .contact-info {
                            margin-top: 20px;
                            font-size: 14px;
                            color: #6b7280;
                        }
                        .badge {
                            display: inline-block;
                            padding: 4px 12px;
                            background: #10b981;
                            color: white;
                            border-radius: 20px;
                            font-size: 12px;
                            font-weight: 600;
                            margin-left: 10px;
                        }
                    </style>
                </head>
                <body>
                    <div class="email-container">
                        <div class="header">
                            <h1>🎓 Student Account Approved</h1>
                            <div class="subtitle">Welcome to %s</div>
                        </div>
                        
                        <div class="content">
                            <div class="greeting">
                                Dear <strong>%s</strong>,
                            </div>
                            
                            <div class="section">
                                <div class="section-title">
                                    📋 Account Information
                                </div>
                                <p>Your student account has been successfully approved and activated.</p>
                                <p>You now have access to the Attenza Student Portal with the following credentials:</p>
                            </div>
                            
                            <div class="section">
                                <div class="section-title">
                                    🔐 Login Credentials
                                </div>
                                <div class="credentials-box">
                                    <div class="credential-item">
                                        <span class="credential-label">🏛️ Institution Code:</span>
                                        <span class="credential-value">%s</span>
                                    </div>
                                    <div class="credential-item">
                                        <span class="credential-label">🎫 Registration Number:</span>
                                        <span class="credential-value">%s</span>
                                    </div>
                                    <div class="credential-item">
                                        <span class="credential-label">🔑 Temporary Password:</span>
                                        <span class="credential-value">%s</span>
                                    </div>
                                    <div class="credential-item">
                                        <span class="credential-label">🌐 Login at Login Portal:</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="section">
                                <div class="section-title">
                                    📝 Login Instructions
                                </div>
                                <div class="instructions">
                                    <ol>
                                        <li><strong>Select</strong> "Student" as the login type</li>
                                        <li><strong>Enter</strong> the Institution Code shown above</li>
                                        <li><strong>Enter</strong> your Registration Number</li>
                                        <li><strong>Enter</strong> the Temporary Password</li>
                                        <li><strong>Change</strong> your password immediately after first login</li>
                                    </ol>
                                </div>
                            </div>
                            
                            <div class="important-note">
                                <div class="important-title">⚠️ Important Security Notes</div>
                                <ul style="margin: 10px 0; padding-left: 20px;">
                                    <li>Keep your credentials confidential</li>
                                    <li>Change your password immediately after first login</li>
                                    <li>Do not share your password with anyone</li>
                                    <li>Contact your institution admin if you suspect unauthorized access</li>
                                </ul>
                            </div>
                        </div>
                        
                        <div class="footer">
                            <p><strong>Best regards,</strong><br>Attenza Administration Team</p>
                            <div class="contact-info">
                                <p>Need help? Contact your institution administrator</p>
                                <p>© %d Attenza. All rights reserved.</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
                """,
                instName,
                fullName,
                publicId,
                regNo,
                password,
                currentYear
            );
        }

private String buildSuspensionEmail(Student s, String reason) {
    String fullName = escapeForFormat(s.getFullName());
    String regNo = escapeForFormat(s.getRegistrationNo());
    String instName = escapeForFormat(s.getInstitution().getName());
    String safeReason = escapeForFormat(reason != null ? reason : "No specific reason provided");
    String emailDomain = escapeForFormat(s.getInstitution().getName().toLowerCase().replaceAll("\\s+", ""));
    
    return String.format("""
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
                    background: linear-gradient(135deg, #dc2626 0%%, #ef4444 100%%);
                    color: white;
                    padding: 30px 20px;
                    text-align: center;
                }
                .header h1 {
                    margin: 0;
                    font-size: 24px;
                }
                .content {
                    padding: 40px;
                }
                .greeting {
                    font-size: 18px;
                    margin-bottom: 25px;
                }
                .suspension-box {
                    background: #fef2f2;
                    border: 3px solid #dc2626;
                    border-radius: 10px;
                    padding: 30px;
                    margin: 25px 0;
                    text-align: center;
                }
                .suspension-title {
                    color: #dc2626;
                    font-size: 22px;
                    margin-bottom: 15px;
                }
                .reason-box {
                    background: #f8fafc;
                    padding: 25px;
                    border-radius: 8px;
                    margin: 25px 0;
                }
                .reason-title {
                    color: #4b5563;
                    font-size: 18px;
                    margin-bottom: 15px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .reason-content {
                    background: white;
                    padding: 20px;
                    border-radius: 6px;
                    border: 1px solid #e5e7eb;
                    font-style: italic;
                }
                .consequences {
                    background: #fffbeb;
                    border-left: 4px solid #f59e0b;
                    padding: 25px;
                    margin: 25px 0;
                    border-radius: 0 8px 8px 0;
                }
                .consequences-title {
                    color: #d97706;
                    font-size: 18px;
                    margin-bottom: 15px;
                }
                .consequences-list {
                    margin: 15px 0;
                    padding-left: 25px;
                }
                .consequences-list li {
                    margin: 10px 0;
                }
                .appeal-process {
                    background: #f0f9ff;
                    padding: 25px;
                    border-radius: 8px;
                    margin: 25px 0;
                }
                .appeal-title {
                    color: #0369a1;
                    font-size: 18px;
                    margin-bottom: 15px;
                }
                .student-info {
                    background: #f8fafc;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 20px 0;
                }
                .info-item {
                    margin: 10px 0;
                    display: flex;
                }
                .info-label {
                    font-weight: 600;
                    color: #4b5563;
                    min-width: 180px;
                }
                .footer {
                    background: #f8fafc;
                    padding: 25px;
                    text-align: center;
                    border-top: 1px solid #eaeaea;
                }
                .contact-info {
                    margin-top: 20px;
                    font-size: 14px;
                    color: #6b7280;
                }
                .urgent {
                    color: #dc2626;
                    font-weight: 600;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <h1>🚫 Account Suspension Notice</h1>
                </div>
                
                <div class="content">
                    <div class="greeting">
                        Dear <strong>%s</strong>,
                    </div>
                    
                    <div class="suspension-box">
                        <div class="suspension-title">
                            ⚠️ ACCOUNT SUSPENDED - IMMEDIATE EFFECT
                        </div>
                        <p>Your student account has been <strong>suspended</strong> and you no longer have access to the Attenza Student Portal.</p>
                    </div>
                    
                    <div class="student-info">
                        <div class="info-item">
                            <span class="info-label">Student Name:</span>
                            <span>%s</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Registration No:</span>
                            <span>%s</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Institution:</span>
                            <span>%s</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Status:</span>
                            <span class="urgent">SUSPENDED</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Effective Date:</span>
                            <span>%s</span>
                        </div>
                    </div>
                    
                    <div class="reason-box">
                        <div class="reason-title">📋 Reason for Suspension</div>
                        <div class="reason-content">
                            %s
                        </div>
                    </div>
                    
                    <div class="consequences">
                        <div class="consequences-title">📉 Consequences of Suspension</div>
                        <ul class="consequences-list">
                            <li><strong>No Access:</strong> Cannot access student portal, courses, or materials</li>
                            <li><strong>Attendance Frozen:</strong> Attendance records are locked</li>
                            <li><strong>No Submissions:</strong> Cannot submit assignments or projects</li>
                            <li><strong>Academic Impact:</strong> May affect academic progression</li>
                            <li><strong>Grade Impact:</strong> May result in failing grades for current courses</li>
                        </ul>
                    </div>
                    
                    <div class="appeal-process">
                        <div class="appeal-title">🔄 Appeal Process</div>
                        <p>If you wish to appeal this suspension:</p>
                        <ol>
                            <li><strong>Contact</strong> your department head or academic advisor</li>
                            <li><strong>Submit</strong> a formal appeal letter within 7 days</li>
                            <li><strong>Include</strong> supporting documents if applicable</li>
                            <li><strong>Attend</strong> the scheduled hearing if required</li>
                        </ol>
                        <p><strong>Appeal Deadline:</strong> %s</p>
                    </div>
                    
                    <p class="urgent">❗ Immediate Action Required: Contact your institution administration to understand the complete implications and appeal process.</p>
                </div>
                
                <div class="footer">
                    <p><strong>Regards,</strong><br>Disciplinary Committee<br>%s</p>
                    <div class="contact-info">
                        <p>For appeals, contact: disciplinary@%s.edu</p>
                        <p>© %d Attenza. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """,
        fullName,
        fullName,
        regNo,
        instName,
        java.time.LocalDate.now().format(java.time.format.DateTimeFormatter.ofPattern("dd MMMM yyyy")),
        safeReason,
        java.time.LocalDate.now().plusDays(7).format(java.time.format.DateTimeFormatter.ofPattern("dd MMMM yyyy")),
        instName,
        emailDomain,
        java.time.Year.now().getValue()
    );
}


    private StudentResponse toResponse(Student s) {
        return new StudentResponse(
                s.getId(),
                s.getPublicId(),
                s.getRegistrationNo(),
                s.getRollNo(),
                s.getFullName(),
                s.getEmail(),
                s.getPhone(),
                s.getGender(),
                s.getDateOfBirth(),

                s.getDepartment(),
                s.getCourse(),
                s.getBatch(),
                s.getSemester(),
                s.getSection(),
                s.getAdmissionType(),

                s.getAttendancePercentage(),
                s.getStatus(),

                s.getAddress(),
                s.getCity(),
                s.getState(),

                s.getGuardianName(),
                s.getGuardianPhone(),

                s.getJoinedDate(),
                s.getLastActive(),
                s.getPasswordHash() != null
        );
    }
}
