package com.medicinachina.website.training.dto;

public record TrainingSummaryResponse(
    Long id,
    String title,
    String slug,
    String summary,
    String imageUrl,
    Integer priceCents,
    String currency,
    String durationLabel,
    String modality,
    boolean accessGranted
) {
}
