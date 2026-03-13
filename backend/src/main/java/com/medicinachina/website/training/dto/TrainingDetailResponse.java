package com.medicinachina.website.training.dto;

import java.util.List;

public record TrainingDetailResponse(
    Long id,
    String title,
    String slug,
    String summary,
    String description,
    String imageUrl,
    Integer priceCents,
    String currency,
    String durationLabel,
    String modality,
    String level,
    List<String> syllabus,
    boolean accessGranted,
    String downloadFilePath,
    boolean active
) {
}
