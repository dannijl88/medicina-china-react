package com.medicinachina.website.review.dto;

import java.time.LocalDateTime;

public record ReviewResponse(
    Long id,
    String itemKey,
    String itemLabel,
    String reviewableType,
    Integer rating,
    String title,
    String comment,
    String authorName,
    String status,
    LocalDateTime createdAt
) {
}
