package com.medicinachina.website.appointment;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByUserIdOrderByAppointmentAtAsc(Long userId);
    List<Appointment> findAllByOrderByAppointmentAtAsc();
    void deleteByUserId(Long userId);
}
