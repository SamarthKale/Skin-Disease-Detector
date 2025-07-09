-- Create and use database
CREATE DATABASE IF NOT EXISTS hackorbit_;
USE hackorbit_;

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE,
    full_name VARCHAR(100),
    role ENUM('admin', 'doctor', 'patient') DEFAULT 'patient',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Patient records table
CREATE TABLE IF NOT EXISTS patient_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    phone VARCHAR(20),
    address TEXT,
    medical_history TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Skin analysis results table (includes severity)
CREATE TABLE IF NOT EXISTS skin_analysis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    image_path VARCHAR(255),
    prediction VARCHAR(100),
    confidence DECIMAL(5,2),
    severity VARCHAR(20),
    analysis_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Insert default admin user (password: admin123 bcrypt hash)
INSERT INTO users (username, password_hash, email, full_name, role) VALUES 
('admin', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK8i', 'admin@vedaralaai.com', 'System Administrator', 'admin')
ON DUPLICATE KEY UPDATE username=username;
