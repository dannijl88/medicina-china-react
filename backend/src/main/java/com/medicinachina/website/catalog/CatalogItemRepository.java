package com.medicinachina.website.catalog;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CatalogItemRepository extends JpaRepository<CatalogItem, Long> {
    boolean existsByTypeAndSlug(CatalogType type, String slug);
    List<CatalogItem> findByTypeAndActiveTrueOrderBySortOrderAscIdAsc(CatalogType type);
    List<CatalogItem> findByTypeOrderBySortOrderAscIdAsc(CatalogType type);
    long countByType(CatalogType type);
}
