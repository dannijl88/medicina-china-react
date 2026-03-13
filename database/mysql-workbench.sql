CREATE DATABASE IF NOT EXISTS medicina_china
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE medicina_china;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT NOT NULL AUTO_INCREMENT,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(120) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL,
  phone VARCHAR(30) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_users_email (email)
);

CREATE TABLE IF NOT EXISTS appointments (
  id BIGINT NOT NULL AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  service_name VARCHAR(120) NOT NULL,
  appointment_at DATETIME NOT NULL,
  status VARCHAR(20) NOT NULL,
  notes VARCHAR(500) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_appointments_user_id (user_id),
  KEY idx_appointments_appointment_at (appointment_at),
  CONSTRAINT fk_appointments_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- Las cuentas demo se crean automaticamente al arrancar la aplicacion
-- si no existen ya en la base de datos:
-- admin@medicinachina.com / Relax2026!
-- cliente@medicinachina.com / Bienestar2026!
