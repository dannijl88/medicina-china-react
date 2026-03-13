package com.medicinachina.website.appointment.dto;

import com.medicinachina.website.appointment.AppointmentStatus;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

public record UpdateAppointmentRequest(
    @NotNull(message = "La fecha es obligatoria")
    @Future(message = "La cita debe ser futura")
    LocalDateTime appointmentAt,
    @Size(max = 500, message = "Las notas son demasiado largas")
    String notes,
    AppointmentStatus status
) {
}
