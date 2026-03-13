package com.medicinachina.website.training;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrainingRepository extends JpaRepository<Training, Long> {

    List<Training> findByActiveTrueOrderByIdAsc();

    Optional<Training> findBySlugAndActiveTrue(String slug);

    boolean existsBySlug(String slug);
}
