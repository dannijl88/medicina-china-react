package com.medicinachina.website.auth;

import java.util.List;

public record AuthResponse(
    String token,
    String username,
    List<String> roles,
    String displayName
) {
}
