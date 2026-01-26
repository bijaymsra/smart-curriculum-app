package com.attenza.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "institutions")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Institution {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔐 SAFE PUBLIC ID (frontend-safe)
    @Column(nullable = false, unique = true, updatable = false)
    private String publicId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false, unique = true)
    private String email;

    private String phone;
    private String address;
    private String city;
    private String state;
    private String country;
    private String zipCode;

    private LocalDateTime createdAt;

    // ✅ Auto-generate fields before insert
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.publicId = "INST-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
