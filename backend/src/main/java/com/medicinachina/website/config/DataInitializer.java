package com.medicinachina.website.config;

import com.medicinachina.website.user.AppUser;
import com.medicinachina.website.user.UserRepository;
import com.medicinachina.website.user.UserRole;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner seedUsers(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (!userRepository.existsByEmail("admin@medicinachina.com")) {
                AppUser admin = new AppUser();
                admin.setFullName("Equipo Medicina China");
                admin.setEmail("admin@medicinachina.com");
                admin.setPasswordHash(passwordEncoder.encode("Relax2026!"));
                admin.setRole(UserRole.ROLE_ADMIN);
                admin.setPhone("600123456");
                userRepository.save(admin);
            }

            if (!userRepository.existsByEmail("cliente@medicinachina.com")) {
                AppUser client = new AppUser();
                client.setFullName("Cliente Bienestar");
                client.setEmail("cliente@medicinachina.com");
                client.setPasswordHash(passwordEncoder.encode("Bienestar2026!"));
                client.setRole(UserRole.ROLE_USER);
                client.setPhone("600654321");
                userRepository.save(client);
            }
        };
    }
}
