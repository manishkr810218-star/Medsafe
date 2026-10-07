-- Drug Interaction Checker: schema (Phase 2). Safe to re-run (IF NOT EXISTS).
-- All interaction rows are DEMO data (is_demo = 1), not clinical data.

CREATE TABLE IF NOT EXISTS patients (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  display_name VARCHAR(100) NOT NULL,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS drugs (
  id      VARCHAR(50)  NOT NULL PRIMARY KEY,
  name    VARCHAR(100) NOT NULL,
  is_demo TINYINT(1)   NOT NULL DEFAULT 1,
  UNIQUE KEY uq_drugs_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS foods (
  id      VARCHAR(50)  NOT NULL PRIMARY KEY,
  name_en VARCHAR(100) NOT NULL,
  name_hi VARCHAR(150) NOT NULL,
  is_demo TINYINT(1)   NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- One row per unordered drug pair. Convention: drug_a_id < drug_b_id
-- (alphabetical). The API matches either order, so this is only for tidiness.
CREATE TABLE IF NOT EXISTS drug_interactions (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  drug_a_id  VARCHAR(50) NOT NULL,
  drug_b_id  VARCHAR(50) NOT NULL,
  severity   ENUM('high','moderate','low') NOT NULL,
  message_en TEXT NOT NULL,
  message_hi TEXT NOT NULL,
  advice_en  TEXT NOT NULL,
  advice_hi  TEXT NOT NULL,
  is_demo    TINYINT(1) NOT NULL DEFAULT 1,
  UNIQUE KEY uq_drug_pair (drug_a_id, drug_b_id),
  CONSTRAINT fk_di_a FOREIGN KEY (drug_a_id) REFERENCES drugs (id),
  CONSTRAINT fk_di_b FOREIGN KEY (drug_b_id) REFERENCES drugs (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS drug_food_interactions (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  drug_id    VARCHAR(50) NOT NULL,
  food_id    VARCHAR(50) NOT NULL,
  severity   ENUM('high','moderate','low') NOT NULL,
  message_en TEXT NOT NULL,
  message_hi TEXT NOT NULL,
  advice_en  TEXT NOT NULL,
  advice_hi  TEXT NOT NULL,
  is_demo    TINYINT(1) NOT NULL DEFAULT 1,
  UNIQUE KEY uq_drug_food (drug_id, food_id),
  CONSTRAINT fk_dfi_drug FOREIGN KEY (drug_id) REFERENCES drugs (id),
  CONSTRAINT fk_dfi_food FOREIGN KEY (food_id) REFERENCES foods (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- drug_id is NULL when the typed name is not in the drugs table ("not verified").
CREATE TABLE IF NOT EXISTS patient_medicines (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  patient_id INT UNSIGNED NOT NULL,
  drug_id    VARCHAR(50) NULL,
  name       VARCHAR(100) NOT NULL,
  dose       VARCHAR(100) NOT NULL DEFAULT '',
  frequency  VARCHAR(100) NOT NULL DEFAULT '',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_patient_medicine (patient_id, name),
  CONSTRAINT fk_pm_patient FOREIGN KEY (patient_id) REFERENCES patients (id) ON DELETE CASCADE,
  CONSTRAINT fk_pm_drug FOREIGN KEY (drug_id) REFERENCES drugs (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
