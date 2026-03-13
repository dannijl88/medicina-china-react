package com.medicinachina.website.catalog.dto;

import com.medicinachina.website.catalog.CatalogType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CatalogItemRequest {

    @NotNull
    private CatalogType type;

    @NotBlank
    private String title;

    @NotBlank
    private String slug;

    @NotBlank
    private String description;

    private String metaPrimary;
    private String metaSecondary;
    private Integer sortOrder;
    private Boolean active;

    public CatalogType getType() {
        return type;
    }

    public void setType(CatalogType type) {
        this.type = type;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getMetaPrimary() {
        return metaPrimary;
    }

    public void setMetaPrimary(String metaPrimary) {
        this.metaPrimary = metaPrimary;
    }

    public String getMetaSecondary() {
        return metaSecondary;
    }

    public void setMetaSecondary(String metaSecondary) {
        this.metaSecondary = metaSecondary;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}
