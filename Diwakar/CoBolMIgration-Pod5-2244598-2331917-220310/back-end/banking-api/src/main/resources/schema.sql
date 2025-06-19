-- Create the banking database if it doesn't exist
CREATE DATABASE IF NOT EXISTS banking_db;
USE banking_db;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS accounts;

-- Create the accounts table
CREATE TABLE accounts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    balance DECIMAL(10, 2) NOT NULL DEFAULT 1000.00
);

-- Insert initial account with default balance
-- Note: The Java application handles this initialization as well
-- INSERT INTO accounts (balance) VALUES (1000.00);
