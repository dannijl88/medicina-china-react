package com.medicinachina.website.catalog.dto;

public record CatalogItemResponse(
    Long id,
    String type,
    String title,
    String slug,
    String description,
    String imageUrl,
    String metaPrimary,
    String metaSecondary,
    boolean active,
    Integer sortOrder
) {
}
