-- Create the IoT Microproject Database
CREATE DATABASE IF NOT EXISTS iot_microproject;
USE iot_microproject;

-- Create sensor_readings table to store timestamped sensor data
CREATE TABLE IF NOT EXISTS sensor_readings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  temperature DECIMAL(5, 2) NOT NULL,
  humidity DECIMAL(5, 2) NOT NULL,
  threshold_value DECIMAL(5, 2) NOT NULL,
  battery_percentage DECIMAL(5, 2) NOT NULL,
  battery_status VARCHAR(20) NOT NULL,
  event_status VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Optional: Create a summary table for daily statistics
CREATE TABLE IF NOT EXISTS daily_summary (
  id INT AUTO_INCREMENT PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  avg_temperature DECIMAL(5, 2),
  max_temperature DECIMAL(5, 2),
  min_temperature DECIMAL(5, 2),
  avg_humidity DECIMAL(5, 2),
  max_humidity DECIMAL(5, 2),
  min_humidity DECIMAL(5, 2),
  avg_battery DECIMAL(5, 2),
  event_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
