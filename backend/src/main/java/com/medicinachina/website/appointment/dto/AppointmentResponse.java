package com.medicinachina.website.appointment.dto;

import com.medicinachina.website.appointment.AppointmentStatus;
import java.time.LocalDateTime;

public record AppointmentResponse(
    Long id,
    String customerName,
    String customerEmail,
    String serviceName,
    LocalDateTime appointmentAt,
    AppointmentStatus status,
    String notes,
    LocalDateTime createdAt
) {
}
