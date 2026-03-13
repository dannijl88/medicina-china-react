package com.medicinachina.website.review;

import com.medicinachina.website.review.dto.CreateReviewRequest;
import com.medicinachina.website.review.dto.ReviewResponse;
import com.medicinachina.website.review.dto.UpdateReviewStatusRequest;
import com.medicinachina.website.user.AppUser;
import com.medicinachina.website.user.UserRepository;
import com.medicinachina.website.user.UserRole;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;

    public ReviewService(ReviewRepository reviewRepository, UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
    }

    public List<ReviewResponse> getApprovedReviews(ReviewableType type, String itemKey) {
        return reviewRepository.findByReviewableTypeAndItemKeyAndStatusOrderByCreatedAtDesc(type, itemKey, ReviewStatus.APPROVED)
            .stream()
            .map(this::toResponse)
            .toList();
    }

    public List<ReviewResponse> getFeaturedReviews() {
        return reviewRepository.findTop12ByStatusOrderByCreatedAtDesc(ReviewStatus.APPROVED)
            .stream()
            .map(this::toResponse)
            .toList();
    }

    public ReviewResponse createReview(String userEmail, CreateReviewRequest request) {
        AppUser user = getUserByEmail(userEmail);

        reviewRepository.findByUserIdAndReviewableTypeAndItemKey(user.getId(), request.reviewableType(), request.itemKey())
            .ifPresent(existing -> {
                throw new IllegalArgumentException("Ya has enviado una reseña para este elemento");
            });

        Review review = new Review();
        review.setUser(user);
        review.setReviewableType(request.reviewableType());
        review.setItemKey(request.itemKey().trim());
        review.setItemLabel(request.itemLabel().trim());
        review.setRating(request.rating());
        review.setTitle(request.title().trim());
        review.setComment(request.comment().trim());
        review.setStatus(ReviewStatus.PENDING);

        return toResponse(reviewRepository.save(review));
    }

    public List<ReviewResponse> getPendingReviews(String userEmail) {
        ensureAdmin(userEmail);
        return reviewRepository.findByStatusOrderByCreatedAtDesc(ReviewStatus.PENDING)
            .stream()
            .map(this::toResponse)
            .toList();
    }

    public List<ReviewResponse> getAllReviews(String userEmail) {
        ensureAdmin(userEmail);
        return reviewRepository.findAll().stream()
            .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
            .map(this::toResponse)
            .toList();
    }

    public ReviewResponse updateStatus(Long reviewId, String userEmail, UpdateReviewStatusRequest request) {
        ensureAdmin(userEmail);
        Review review = reviewRepository.findById(reviewId)
            .orElseThrow(() -> new IllegalArgumentException("La reseña no existe"));
        review.setStatus(request.status());
        return toResponse(reviewRepository.save(review));
    }

    private AppUser getUserByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
    }

    private void ensureAdmin(String userEmail) {
        AppUser user = getUserByEmail(userEmail);
        if (user.getRole() != UserRole.ROLE_ADMIN) {
            throw new IllegalArgumentException("Solo administración puede moderar reseñas");
        }
    }

    private ReviewResponse toResponse(Review review) {
        return new ReviewResponse(
            review.getId(),
            review.getItemKey(),
            review.getItemLabel(),
            review.getReviewableType().name(),
            review.getRating(),
            review.getTitle(),
            review.getComment(),
            review.getUser().getFullName(),
            review.getStatus().name(),
            review.getCreatedAt()
        );
    }
}
