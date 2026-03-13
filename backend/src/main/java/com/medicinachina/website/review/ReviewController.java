package com.medicinachina.website.review;

import com.medicinachina.website.review.dto.CreateReviewRequest;
import com.medicinachina.website.review.dto.ReviewResponse;
import com.medicinachina.website.review.dto.UpdateReviewStatusRequest;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping
    public List<ReviewResponse> getApprovedReviews(
        @RequestParam ReviewableType type,
        @RequestParam String itemKey
    ) {
        return reviewService.getApprovedReviews(type, itemKey);
    }

    @GetMapping("/featured")
    public List<ReviewResponse> getFeaturedReviews() {
        return reviewService.getFeaturedReviews();
    }

    @PostMapping
    public ReviewResponse createReview(@Valid @RequestBody CreateReviewRequest request, Authentication authentication) {
        return reviewService.createReview(authentication.getName(), request);
    }

    @GetMapping("/pending")
    public List<ReviewResponse> getPendingReviews(Authentication authentication) {
        return reviewService.getPendingReviews(authentication.getName());
    }

    @GetMapping("/admin")
    public List<ReviewResponse> getAllReviews(Authentication authentication) {
        return reviewService.getAllReviews(authentication.getName());
    }

    @PutMapping("/{reviewId}/status")
    public ReviewResponse updateReviewStatus(
        @PathVariable Long reviewId,
        @Valid @RequestBody UpdateReviewStatusRequest request,
        Authentication authentication
    ) {
        return reviewService.updateStatus(reviewId, authentication.getName(), request);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgument(IllegalArgumentException exception) {
        return ResponseEntity.badRequest().body(exception.getMessage());
    }
}
