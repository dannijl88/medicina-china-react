package com.medicinachina.website.review.dto;

import com.medicinachina.website.review.ReviewStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateReviewStatusRequest(@NotNull ReviewStatus status) {
}
