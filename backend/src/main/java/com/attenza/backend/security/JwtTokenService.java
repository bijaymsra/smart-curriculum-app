package com.attenza.backend.security;

import com.attenza.backend.entity.Student;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtTokenService {

    private final SecretKey key;

    private static final long EXPIRATION_MS = 24 * 60 * 60 * 1000; // 1 day

    public JwtTokenService(
            @Value("${attendance.qr.secret}") String secret
    ) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    /* =====================================================
       STUDENT TOKEN (Existing - unchanged behavior)
    ===================================================== */

    public String generateToken(Student student) {
        return generateToken(
                String.valueOf(student.getId()),
                "STUDENT"
        );
    }

    /* =====================================================
       GENERIC TOKEN (For Faculty, Admin, etc.)
    ===================================================== */

    public String generateToken(String subject, String role) {
        return Jwts.builder()
                .setSubject(subject)   // Can be studentId or facultyId
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    /* =====================================================
       Extract Subject (Generic)
    ===================================================== */

    public String extractSubject(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    public String extractRole(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.get("role", String.class);
    }

    /* =====================================================
       Backward Compatible Method (Student only)
    ===================================================== */

    public Long extractStudentId(String token) {
        return Long.parseLong(extractSubject(token));
    }
}
