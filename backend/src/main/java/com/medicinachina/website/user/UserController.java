package com.medicinachina.website.user;

import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @GetMapping("/me")
    public UserProfileResponse me(Authentication authentication) {
        List<String> roles = authentication.getAuthorities().stream().map(auth -> auth.getAuthority()).toList();
        AuthenticatedUser authenticatedUser = (AuthenticatedUser) authentication.getPrincipal();
        AppUser user = authenticatedUser.getUser();

        return new UserProfileResponse(
            user.getEmail(),
            user.getFullName(),
            roles,
            List.of(
                "Acceso al area privada de seguimiento",
                "Solicitud y gestion de citas online",
                "Recepcion de novedades sobre productos artesanales"
            )
        );
    }
}
