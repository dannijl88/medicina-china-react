package com.medicinachina.website.training;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrainingPurchaseRepository extends JpaRepository<TrainingPurchase, Long> {

    List<TrainingPurchase> findByUserIdOrderByCreatedAtDesc(Long userId);

    boolean existsByUserIdAndTrainingIdAndStatus(Long userId, Long trainingId, PurchaseStatus status);

    Optional<TrainingPurchase> findFirstByUserIdAndTrainingIdAndStatusOrderByCreatedAtDesc(Long userId, Long trainingId, PurchaseStatus status);

    Optional<TrainingPurchase> findByStripeSessionId(String stripeSessionId);

    void deleteByUserId(Long userId);
}
