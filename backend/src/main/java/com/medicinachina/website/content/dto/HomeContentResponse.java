package com.medicinachina.website.content.dto;

import java.util.List;

public record HomeContentResponse(
    HeroContent hero,
    List<TherapyItem> therapies,
    List<WorkshopItem> workshops,
    List<ProductItem> products
) {
}
