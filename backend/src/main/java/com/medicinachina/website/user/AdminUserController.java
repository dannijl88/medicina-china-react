package com.medicinachina.website.user;

import com.medicinachina.website.appointment.AppointmentRepository;
import com.medicinachina.website.review.ReviewRepository;
import com.medicinachina.website.training.TrainingPurchaseRepository;
import java.util.List;
import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;
    private final ReviewRepository reviewRepository;
    private final TrainingPurchaseRepository trainingPurchaseRepository;

    public AdminUserController(
        UserRepository userRepository,
        AppointmentRepository appointmentRepository,
        ReviewRepository reviewRepository,
        TrainingPurchaseRepository trainingPurchaseRepository
    ) {
        this.userRepository = userRepository;
        this.appointmentRepository = appointmentRepository;
        this.reviewRepository = reviewRepository;
        this.trainingPurchaseRepository = trainingPurchaseRepository;
    }

    @GetMapping
    public List<AdminUserResponse> listUsers(Authentication authentication) {
        AppUser requester = userRepository.findByEmail(authentication.getName())
            .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        if (requester.getRole() != UserRole.ROLE_ADMIN) {
            throw new IllegalArgumentException("Solo administracion puede ver usuarios");
        }
        return userRepository.findAllByOrderByCreatedAtDesc().stream()
            .map(user -> new AdminUserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole().name(),
                user.getPhone(),
                user.getCreatedAt()
            ))
            .toList();
    }

    @DeleteMapping("/{userId}")
    @Transactional
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId, Authentication authentication) {
        AppUser requester = userRepository.findByEmail(authentication.getName())
            .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        if (requester.getRole() != UserRole.ROLE_ADMIN) {
            throw new IllegalArgumentException("Solo administracion puede borrar usuarios");
        }
        if (requester.getId().equals(userId)) {
            throw new IllegalArgumentException("No puedes borrarte a ti mismo");
        }
        if (!userRepository.existsById(userId)) {
            throw new IllegalArgumentException("Usuario no encontrado");
        }
        appointmentRepository.deleteByUserId(userId);
        reviewRepository.deleteByUserId(userId);
        trainingPurchaseRepository.deleteByUserId(userId);
        userRepository.deleteById(userId);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgument(IllegalArgumentException exception) {
        return ResponseEntity.badRequest().body(exception.getMessage());
    }
}
