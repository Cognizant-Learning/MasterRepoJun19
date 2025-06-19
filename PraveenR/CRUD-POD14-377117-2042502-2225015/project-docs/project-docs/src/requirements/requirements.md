# Business Requirements Document for Project Apex: The Intelligent Inventory Hub

## Introduction
This document outlines the business requirements for the development of the Intelligent Inventory Hub, a single-page web application designed to streamline inventory management for business owners.

## Core User Story
"As a store manager, I want to see all my items in a central dashboard, be able to add, update, and remove stock instantly, and get quick insights into my inventory's health, so I can make smarter decisions and stop wasting time on manual data entry."

## MVP Requirements

### 1. The Dashboard View
- **Key Stats:** 
  - Total Unique Items
  - Items Low on Stock
  - Items Out of Stock
- **The Inventory Table:** 
  - A clean, sortable table displaying all items.
- **Essential Columns:** 
  - Name
  - SKU
  - Category
  - Price
  - Quantity
- **Search & Filter:** 
  - A single search bar that can filter the table in real-time.

### 2. Core CRUD Functionality
- **Create Item:** 
  - A simple form (or modal) to add a new item with the essential fields.
- **Update Item:** 
  - An "Edit" button on each row that allows modification of an item's details.
- **Delete Item:** 
  - A "Delete" button on each row with a confirmation step (Are you sure?).

### 3. The "Low Stock" Alert
- Items in the table should be visually highlighted (e.g., a yellow or red background) if their quantity falls below a predefined threshold (e.g., 10 units).

## Stretch Goals
- **Data Visualization:** 
  - Add a simple bar or pie chart showing item quantities by category.
- **Image Uploads:** 
  - Allow users to upload a product image when creating/editing an item.
- **Bulk Operations:** 
  - Implement "batch delete" using checkboxes on the table.
- **Activity Log:** 
  - A small panel showing the last 5-10 actions taken (e.g., "Item 'T-Shirt' created").