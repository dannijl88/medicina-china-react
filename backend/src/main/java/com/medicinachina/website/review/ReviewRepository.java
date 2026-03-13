package com.medicinachina.website.review;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByReviewableTypeAndItemKeyAndStatusOrderByCreatedAtDesc(
        ReviewableType reviewableType,
        String itemKey,
        ReviewStatus status
    );

    List<Review> findByStatusOrderByCreatedAtDesc(ReviewStatus status);

    List<Review> findTop12ByStatusOrderByCreatedAtDesc(ReviewStatus status);

    Optional<Review> findByUserIdAndReviewableTypeAndItemKey(Long userId, ReviewableType reviewableType, String itemKey);

    void deleteByUserId(Long userId);
}
