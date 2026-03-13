package com.medicinachina.website.review.dto;

import com.medicinachina.website.review.ReviewableType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateReviewRequest(
    @NotNull ReviewableType reviewableType,
    @NotBlank String itemKey,
    @NotBlank String itemLabel,
    @NotNull @Min(1) @Max(5) Integer rating,
    @NotBlank String title,
    @NotBlank String comment
) {
}
