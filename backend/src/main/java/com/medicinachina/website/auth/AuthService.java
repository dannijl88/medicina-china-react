package com.medicinachina.website.auth;

import com.medicinachina.website.security.JwtService;
import com.medicinachina.website.user.AppUser;
import com.medicinachina.website.user.AuthenticatedUser;
import com.medicinachina.website.user.UserRepository;
import com.medicinachina.website.user.UserRole;
import java.util.List;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Ya existe un usuario con ese email");
        }

        AppUser user = new AppUser();
        user.setFullName(request.fullName());
        user.setEmail(request.email());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole(UserRole.ROLE_USER);
        user.setPhone(request.phone());

        AppUser savedUser = userRepository.save(user);
        AuthenticatedUser authenticatedUser = new AuthenticatedUser(savedUser);

        return new AuthResponse(
            jwtService.generateToken(authenticatedUser),
            savedUser.getEmail(),
            List.of(savedUser.getRole().name()),
            savedUser.getFullName()
        );
    }
}
