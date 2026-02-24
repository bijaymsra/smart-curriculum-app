package com.attenza.backend.service.admin;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.mail.SimpleMailMessage;

@Service
@RequiredArgsConstructor
public class EmailService {
    
    private final JavaMailSender mailSender;
    
    @Async
    public void sendEmail(String to, String subject, String body) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true); 
            
            mailSender.send(mimeMessage);
            System.out.println("HTML email sent successfully to: " + to);
            
        } catch (MessagingException e) {
            System.err.println("Failed to send HTML email to: " + to + " - " + e.getMessage());
            
            try {
                String plainText = extractPlainText(body);
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(to);
                message.setSubject(subject);
                message.setText(plainText);
                mailSender.send(message);
                System.out.println("Plain text fallback email sent to: " + to);
            } catch (Exception ex) {
                System.err.println("Failed to send fallback email: " + ex.getMessage());
            }
        }
    }
    
    private String extractPlainText(String html) {
        if (html == null || html.trim().isEmpty()) {
            return "";
        }
        
        String text = html
            .replaceAll("<head>.*?</head>", "")
            .replaceAll("<style>.*?</style>", "")
            .replaceAll("<script>.*?</script>", "")
            .replaceAll("<[^>]*>", "")
            .replaceAll("&nbsp;", " ")
            .replaceAll("\\s+", " ")
            .replaceAll("\\n\\s*\\n", "\n\n")
            .trim();
        
        text = text
            .replaceAll("Dear\\s+", "\n\nDear ")
            .replaceAll("Best regards,", "\n\nBest regards,")
            .replaceAll("Sincerely,", "\n\nSincerely,")
            .replaceAll("Regards,", "\n\nRegards,");
        
        return text;
    }
}