package com.attenza.backend.attendance.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.UUID;

@Service
public class AttendanceQrTokenService {

    @Value("${attendance.qr.secret}")
    private String secret;

    @Value("${attendance.qr.validity-seconds}")
    private long validitySeconds;

    /**
     * Generates a signed, time-bound QR token
     */
    public String generateToken(String sessionId, Long classId) {

        long issuedAt = Instant.now().getEpochSecond();
        String nonce = UUID.randomUUID().toString().substring(0, 6);

        String payload =
                sessionId + "|" +
                classId + "|" +
                issuedAt + "|" +
                nonce;

        String signature = sign(payload);

        return Base64.getUrlEncoder().encodeToString(payload.getBytes(StandardCharsets.UTF_8))
                + "."
                + Base64.getUrlEncoder().encodeToString(signature.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Verifies token integrity & expiry
     * Returns sessionId if valid
     */
    public String verifyAndExtractSessionId(String token) {

        String[] parts = token.split("\\.");
        if (parts.length != 2) {
            throw new RuntimeException("Invalid QR token format");
        }

        String payload = new String(
                Base64.getUrlDecoder().decode(parts[0]),
                StandardCharsets.UTF_8
        );

        String signature = new String(
                Base64.getUrlDecoder().decode(parts[1]),
                StandardCharsets.UTF_8
        );

        if (!sign(payload).equals(signature)) {
            throw new RuntimeException("Invalid QR signature");
        }

        String[] fields = payload.split("\\|");
        if (fields.length != 4) {
            throw new RuntimeException("Invalid QR payload");
        }

        long issuedAt = Long.parseLong(fields[2]);
        long now = Instant.now().getEpochSecond();

        if (now - issuedAt > validitySeconds) {
            throw new RuntimeException("QR code expired");
        }

        return fields[0]; // sessionId
    }

    /* =========================
       INTERNAL SIGNING
       ========================= */

    private String sign(String data) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(
                    secret.getBytes(StandardCharsets.UTF_8),
                    "HmacSHA256"
            ));

            byte[] raw = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().encodeToString(raw);

        } catch (Exception e) {
            throw new RuntimeException("QR token signing failed", e);
        }
    }
}
