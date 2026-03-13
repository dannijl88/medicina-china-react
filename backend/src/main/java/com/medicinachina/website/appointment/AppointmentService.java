package com.medicinachina.website.appointment;

import com.medicinachina.website.appointment.dto.AppointmentResponse;
import com.medicinachina.website.appointment.dto.CreateAppointmentRequest;
import com.medicinachina.website.appointment.dto.UpdateAppointmentRequest;
import com.medicinachina.website.appointment.dto.UpdateAppointmentStatusRequest;
import com.medicinachina.website.user.AppUser;
import com.medicinachina.website.user.UserRepository;
import com.medicinachina.website.user.UserRole;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    public AppointmentService(AppointmentRepository appointmentRepository, UserRepository userRepository) {
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
    }

    public AppointmentResponse createAppointment(String email, CreateAppointmentRequest request) {
        AppUser user = findUserByEmail(email);

        Appointment appointment = new Appointment();
        appointment.setUser(user);
        appointment.setServiceName(request.serviceName());
        appointment.setAppointmentAt(request.appointmentAt());
        appointment.setStatus(AppointmentStatus.PENDING);
        appointment.setNotes(request.notes());

        return toResponse(appointmentRepository.save(appointment));
    }

    public List<AppointmentResponse> getUserAppointments(String email) {
        AppUser user = findUserByEmail(email);
        return appointmentRepository.findByUserIdOrderByAppointmentAtAsc(user.getId()).stream()
            .map(this::toResponse)
            .toList();
    }

    public AppointmentResponse updateOwnAppointment(Long appointmentId, String email, UpdateAppointmentRequest request) {
        Appointment appointment = findAppointment(appointmentId);
        if (!appointment.getUser().getEmail().equals(email)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No puedes modificar esta cita");
        }
        if (appointment.getStatus() == AppointmentStatus.CANCELLED || appointment.getStatus() == AppointmentStatus.COMPLETED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Esta cita ya no se puede modificar");
        }

        appointment.setAppointmentAt(request.appointmentAt());
        appointment.setNotes(request.notes());
        if (request.status() != null) {
            appointment.setStatus(request.status());
        }

        return toResponse(appointmentRepository.save(appointment));
    }

    public AppointmentResponse cancelOwnAppointment(Long appointmentId, String email) {
        Appointment appointment = findAppointment(appointmentId);
        if (!appointment.getUser().getEmail().equals(email)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No puedes cancelar esta cita");
        }
        appointment.setStatus(AppointmentStatus.CANCELLED);
        return toResponse(appointmentRepository.save(appointment));
    }

    public List<AppointmentResponse> getAllAppointments(String email) {
        AppUser user = findUserByEmail(email);
        if (user.getRole() != UserRole.ROLE_ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo administracion puede ver todas las citas");
        }

        return appointmentRepository.findAllByOrderByAppointmentAtAsc().stream()
            .map(this::toResponse)
            .toList();
    }

    public AppointmentResponse updateAppointmentStatus(Long appointmentId, String email, UpdateAppointmentStatusRequest request) {
        AppUser user = findUserByEmail(email);
        if (user.getRole() != UserRole.ROLE_ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo administracion puede gestionar estados");
        }

        Appointment appointment = findAppointment(appointmentId);
        appointment.setStatus(request.status());
        return toResponse(appointmentRepository.save(appointment));
    }

    private AppUser findUserByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
    }

    private Appointment findAppointment(Long appointmentId) {
        return appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cita no encontrada"));
    }

    private AppointmentResponse toResponse(Appointment appointment) {
        return new AppointmentResponse(
            appointment.getId(),
            appointment.getUser().getFullName(),
            appointment.getUser().getEmail(),
            appointment.getServiceName(),
            appointment.getAppointmentAt(),
            appointment.getStatus(),
            appointment.getNotes(),
            appointment.getCreatedAt()
        );
    }
}
