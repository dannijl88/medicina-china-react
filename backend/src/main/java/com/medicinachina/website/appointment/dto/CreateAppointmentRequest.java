package com.medicinachina.website.appointment.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

public record CreateAppointmentRequest(
    @NotBlank(message = "El servicio es obligatorio")
    @Size(max = 120, message = "El servicio es demasiado largo")
    String serviceName,
    @NotNull(message = "La fecha es obligatoria")
    @Future(message = "La cita debe ser futura")
    LocalDateTime appointmentAt,
    @Size(max = 500, message = "Las notas son demasiado largas")
    String notes
) {
}
