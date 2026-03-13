package com.medicinachina.website.user;

import java.util.List;

public record UserProfileResponse(
    String username,
    String displayName,
    List<String> roles,
    List<String> benefits
) {
}
