# Pharmacy Dashboard Development - Agent Prompts

This document contains all the prompts that were used with the GitHub Copilot agent to develop the pharmacy inventory management dashboard.

## Introduction to Agent

**Prompt:**
I am Pranjal, I am a software architect, I am participating in a Hackathon competition where I need to complete a use case in 2 hours. Need your help

## Initial Setup and Requirements

**Prompt 1:**
We need to create a pharmacy inventory management dashboard capable of adding new pharmacy items to inventory, updating an existing pharmacy item in inventory, reading an existing pharmacy item in inventory and deleting an existing pharmacy item from inventory.
The inventory management app needs to have a User Interface for user interaction and also all CRUD functionality must be driven by CRUD operation APIs.

**Prompt 2:**
This usecase we need to start from scratch.
Please create a new project named it as pharmacy_inventory_dashboard_web_app in the current workspace.
We want to build this use case using React JS for User Interface and NodeJS for backend APIs.
We want to use MySQL as the database for storage.
We want to write unit test cases for the entire code base.

## Analytics Requirements

**Prompt 3:**
We want have three analytic view on UI as Core Medication Categories, Administrative Categories and Additional Categories. Analyse all three categories based on Sales by category, Profit margins per category, Expiration tracking by category, Inventory turnover rates, Stockout frequency and Seasonal demand patterns.

**Prompt 4:**
We want to subcategorize Core Medication Categories as Prescription Medications and Over-the-Counter (OTC) Medications.
We want to subcategorize Additional Categories as Medical Supplies, Vitamins and Supplements, and Personal Care Products.
We want to subcategorize Administrative Categories as Controlled Substances (by schedule) and Inventory Attributes.

## Notification and AutoFill Features

**Prompt 5:**
We want to integrate a notification related functionality. Once any pharmacy item category gets out then notify pharmacy about it in a notification tab on UI.
We want to have some auto fill inventory feature. If an pharmacy inventory item opts for it. Then there should be an auto fill of some default number of pharmacy item once it is out of stock.
Please refer to inventory alert notification criteria as Low Stock Alerts: Notify when items fall below predefined thresholds, Out of Stock Alerts: Immediate notifications when items are completely depleted, Expiration Alerts: Tiered notifications (90/60/30 days before expiration), and Price Change Alerts: Notify when supplier prices change significantly.

## Application Build and Testing

**Prompt 6:**
Please compile and run the application.

## Mock Implementation

**Prompt 7:**
Create a mock response to test frontend of the application and stop any dependency on backend.

**Prompt 8:**
Please create a mock json for the frontend view. And that should satisfy all the functionality with no dependency on backend api.

**Prompt 9:**
Please give sample app where usage of this app can be done and verified.

## Additional Requirements (Ask Mode)

**Prompt 1:**
We need to create an inventory management dashboard capable of adding new items to inventory, updating an existing item in inventory, reading an existing item in inventory and deleting an existing item from inventory.
The inventory management app needs to have a User Interface for user interaction and also all CRUD functionality must be driven by CRUD operation APIs.

**Prompt 2:**
We want to integrate some analytics related functionality to view pharmacy inventory item categories. Please suggest
What all possible pharmacy related categories available to be added in an inventory. Please suggest.

**Prompt 3:**
We want to integrate a notification related functionality in our pharmacy inventory management dashboard. Please suggest.
