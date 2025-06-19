-- SQL Setup Script for Inventory Dashboard

-- Create Database (if it doesn't exist)
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'inventory')
BEGIN
    CREATE DATABASE inventory;
END
GO

USE inventory;
GO

-- Create Inventory Table (if it doesn't exist)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='inventory_items' AND xtype='U')
BEGIN
    CREATE TABLE inventory_items (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(255) NOT NULL,
        sku NVARCHAR(50) NOT NULL UNIQUE,
        category NVARCHAR(100) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        quantity INT NOT NULL
    );
END
GO

-- Add Sample Data (if table is empty)
IF NOT EXISTS (SELECT TOP 1 * FROM inventory_items)
BEGIN
    INSERT INTO inventory_items (name, sku, category, price, quantity)
    VALUES 
        ('Office Chair', 'FRN-1001', 'Furniture', 199.99, 15),
        ('Premium Desk', 'FRN-2002', 'Furniture', 349.99, 8),
        ('Wireless Mouse', 'ELC-3001', 'Electronics', 24.99, 30),
        ('Mechanical Keyboard', 'ELC-3002', 'Electronics', 89.99, 5),
        ('Monitor Stand', 'ACC-4001', 'Accessories', 49.99, 0),
        ('Laptop Cooling Pad', 'ACC-4002', 'Accessories', 29.99, 12),
        ('External Hard Drive', 'ELC-3003', 'Electronics', 79.99, 3),
        ('Office Lamp', 'FRN-1002', 'Furniture', 59.99, 9),
        ('Whiteboard', 'OFF-5001', 'Office Supplies', 119.99, 7),
        ('Printer Paper', 'OFF-5002', 'Office Supplies', 12.99, 25);
END
GO

-- Create Stored Procedure for Dashboard Stats
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'GetDashboardStats')
    DROP PROCEDURE GetDashboardStats
GO

CREATE PROCEDURE GetDashboardStats
    @LowStockThreshold INT = 10
AS
BEGIN
    SELECT 
        (SELECT COUNT(*) FROM inventory_items) AS TotalItems,
        (SELECT COUNT(*) FROM inventory_items WHERE quantity > 0 AND quantity < @LowStockThreshold) AS LowStockItems,
        (SELECT COUNT(*) FROM inventory_items WHERE quantity = 0) AS OutOfStockItems
END
GO
