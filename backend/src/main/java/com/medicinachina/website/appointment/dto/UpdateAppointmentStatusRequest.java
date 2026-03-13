package com.medicinachina.website.appointment.dto;

import com.medicinachina.website.appointment.AppointmentStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateAppointmentStatusRequest(
    @NotNull(message = "El estado es obligatorio")
    AppointmentStatus status
) {
}
