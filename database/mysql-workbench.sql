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

CREATE TABLE IF NOT EXISTS trainings (
  id BIGINT NOT NULL AUTO_INCREMENT,
  title VARCHAR(180) NOT NULL,
  slug VARCHAR(180) NOT NULL,
  summary VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  price_cents INT NOT NULL,
  currency VARCHAR(10) NOT NULL,
  duration_label VARCHAR(80) NOT NULL,
  modality VARCHAR(80) NOT NULL,
  level VARCHAR(80) NOT NULL,
  syllabus TEXT NULL,
  download_file_path VARCHAR(255) NOT NULL,
  active BIT(1) NOT NULL DEFAULT b'1',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_trainings_slug (slug)
);

CREATE TABLE IF NOT EXISTS training_purchases (
  id BIGINT NOT NULL AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  training_id BIGINT NOT NULL,
  status VARCHAR(20) NOT NULL,
  amount_cents INT NOT NULL,
  currency VARCHAR(10) NOT NULL,
  stripe_session_id VARCHAR(120) NULL,
  stripe_payment_intent_id VARCHAR(120) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_training_purchases_stripe_session_id (stripe_session_id),
  KEY idx_training_purchases_user_id (user_id),
  KEY idx_training_purchases_training_id (training_id),
  CONSTRAINT fk_training_purchases_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_training_purchases_training
    FOREIGN KEY (training_id) REFERENCES trainings (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS catalog_items (
  id BIGINT NOT NULL AUTO_INCREMENT,
  type VARCHAR(20) NOT NULL,
  title VARCHAR(180) NOT NULL,
  slug VARCHAR(180) NOT NULL,
  description VARCHAR(1600) NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  meta_primary VARCHAR(120) NULL,
  meta_secondary VARCHAR(120) NULL,
  active BIT(1) NOT NULL DEFAULT b'1',
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_catalog_items_type (type)
);

CREATE TABLE IF NOT EXISTS reviews (
  id BIGINT NOT NULL AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  reviewable_type VARCHAR(20) NOT NULL,
  item_key VARCHAR(120) NOT NULL,
  item_label VARCHAR(180) NOT NULL,
  rating INT NOT NULL,
  title VARCHAR(180) NOT NULL,
  comment VARCHAR(1500) NOT NULL,
  status VARCHAR(20) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_reviews_user_id (user_id),
  KEY idx_reviews_item (reviewable_type, item_key, status),
  CONSTRAINT fk_reviews_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- Las cuentas demo se crean automaticamente al arrancar la aplicacion
-- si no existen ya en la base de datos:
-- admin@medicinachina.com / Relax2026!
-- cliente@medicinachina.com / Bienestar2026!

-- Las formaciones demo tambien se crean automaticamente al arrancar la aplicacion
-- si no existen ya en la base de datos.
