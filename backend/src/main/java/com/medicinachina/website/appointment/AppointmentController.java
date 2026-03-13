package com.medicinachina.website.appointment;

import com.medicinachina.website.appointment.dto.AppointmentResponse;
import com.medicinachina.website.appointment.dto.CreateAppointmentRequest;
import com.medicinachina.website.appointment.dto.UpdateAppointmentRequest;
import com.medicinachina.website.appointment.dto.UpdateAppointmentStatusRequest;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping
    public AppointmentResponse createAppointment(@Valid @RequestBody CreateAppointmentRequest request, Authentication authentication) {
        return appointmentService.createAppointment(authentication.getName(), request);
    }

    @GetMapping("/me")
    public List<AppointmentResponse> getMyAppointments(Authentication authentication) {
        return appointmentService.getUserAppointments(authentication.getName());
    }

    @PutMapping("/{appointmentId}")
    public AppointmentResponse updateAppointment(
        @PathVariable Long appointmentId,
        @Valid @RequestBody UpdateAppointmentRequest request,
        Authentication authentication
    ) {
        return appointmentService.updateOwnAppointment(appointmentId, authentication.getName(), request);
    }

    @DeleteMapping("/{appointmentId}")
    public AppointmentResponse cancelAppointment(@PathVariable Long appointmentId, Authentication authentication) {
        return appointmentService.cancelOwnAppointment(appointmentId, authentication.getName());
    }

    @GetMapping
    public List<AppointmentResponse> getAllAppointments(Authentication authentication) {
        return appointmentService.getAllAppointments(authentication.getName());
    }

    @PutMapping("/{appointmentId}/status")
    public AppointmentResponse updateAppointmentStatus(
        @PathVariable Long appointmentId,
        @Valid @RequestBody UpdateAppointmentStatusRequest request,
        Authentication authentication
    ) {
        return appointmentService.updateAppointmentStatus(appointmentId, authentication.getName(), request);
    }

    @DeleteMapping("/admin/{appointmentId}")
    public void deleteAppointmentAsAdmin(@PathVariable Long appointmentId, Authentication authentication) {
        appointmentService.deleteAppointment(appointmentId, authentication.getName());
    }
}
