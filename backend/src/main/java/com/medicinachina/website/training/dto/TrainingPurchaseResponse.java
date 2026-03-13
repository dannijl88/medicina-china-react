package com.medicinachina.website.training.dto;

import java.time.LocalDateTime;

public record TrainingPurchaseResponse(
    Long id,
    Long trainingId,
    String trainingTitle,
    String trainingSlug,
    String status,
    Integer amountCents,
    String currency,
    LocalDateTime createdAt,
    LocalDateTime completedAt
) {
}
