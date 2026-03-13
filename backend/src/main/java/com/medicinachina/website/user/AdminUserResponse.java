package com.medicinachina.website.user;

import java.time.LocalDateTime;

public record AdminUserResponse(
    Long id,
    String fullName,
    String email,
    String role,
    String phone,
    LocalDateTime createdAt
) {
}
