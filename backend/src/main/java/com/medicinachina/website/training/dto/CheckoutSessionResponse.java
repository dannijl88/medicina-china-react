package com.medicinachina.website.training.dto;

public record CheckoutSessionResponse(
    String checkoutUrl,
    boolean mockMode,
    boolean alreadyPurchased,
    String message
) {
}
