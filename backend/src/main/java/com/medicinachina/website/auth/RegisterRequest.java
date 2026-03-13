package com.medicinachina.website.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 120, message = "El nombre es demasiado largo")
    String fullName,
    @Email(message = "El usuario debe ser un email valido")
    @NotBlank(message = "El email es obligatorio")
    String email,
    @NotBlank(message = "La password es obligatoria")
    @Size(min = 8, message = "La password debe tener al menos 8 caracteres")
    String password,
    @Size(max = 30, message = "El telefono es demasiado largo")
    String phone
) {
}
