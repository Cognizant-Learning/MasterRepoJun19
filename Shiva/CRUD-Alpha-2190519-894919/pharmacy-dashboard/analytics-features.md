# Pharmacy Dashboard Analytics

This document describes the advanced analytics features implemented in the Pharmacy Inventory Management Dashboard.

## Analytics Categories Structure

The dashboard provides analytics broken down into three main category groups, each with specific subcategories:

### 1. Core Medication Categories
#### Prescription Medications
- Antibiotics
- Antihypertensives
- Antidiabetics
- Cardiovascular medications
- Pain management
- Psychiatric medications
- Anticoagulants
- Gastrointestinal medications
- Respiratory medications
- Dermatological medications

#### Over-the-Counter (OTC) Medications
- Pain relievers/antipyretics
- Cough and cold preparations
- Allergy medications
- Digestive aids/antacids
- Sleep aids
- Topical treatments

### 2. Additional Categories
#### Medical Supplies
- First aid supplies
- Bandages and dressings
- Syringes and needles
- Blood glucose monitoring supplies
- Mobility aids

#### Vitamins and Supplements
- Multivitamins
- Minerals
- Herbal supplements
- Protein supplements
- Specialty supplements

#### Personal Care Products
- Skin care
- Dental care
- Eye care
- Baby care
- Feminine hygiene

### 3. Administrative Categories
#### Controlled Substances
- Schedule II
- Schedule III
- Schedule IV
- Schedule V

#### Inventory Attributes
- Temperature-controlled
- Refrigerated
- Specialty
- Recall-affected
- Expiring

## Analyzed Metrics

For each category group, the following metrics are analyzed:

### Sales Analysis
- Total sales value by category
- Comparative sales performance
- Revenue contribution per category
- Sales trend visualization

### Profit Margin Analysis
- Profit margin percentage by category
- Comparative profitability
- High vs. low margin product identification
- Margin optimization opportunities

### Expiration Tracking
- Expiry rate by category
- Risk analysis for perishable items
- Upcoming expirations
- Loss prevention insights

### Inventory Turnover Rates
- Turnover frequency by category
- Fast vs. slow-moving inventory identification
- Inventory efficiency metrics
- Stocking optimization opportunities

### Stockout Frequency
- Stockout percentage by category
- Inventory reliability metrics
- Critical product availability analysis
- Reordering optimization insights

### Seasonal Demand Patterns
- Monthly demand fluctuations
- Seasonal trends by category
- Demand forecasting visualization
- Inventory planning insights

## Enhanced Subcategory Analytics

The dashboard now provides multilevel analytics allowing users to:

1. **View analytics by category group**: See high-level metrics for Core Medication, Additional, and Administrative category groups.

2. **View analytics by subcategory**: Drill down into subcategory data such as Prescription Medications, OTC Medications, Medical Supplies, etc.

3. **View analytics by specific category**: Further drill down into specific categories like Antibiotics, Antihypertensives, etc.

### New Analytics Features

- **Subcategory Distribution Analysis**: View pie charts showing distribution of inventory across subcategories
- **Subcategory Comparison**: Compare metrics like profit margin, turnover rate, and low stock items across subcategories
- **Categorical Hierarchy**: Navigate through the categorical hierarchy from group to subcategory to specific category

## Data Visualization

The dashboard provides multiple visualization types:

1. **Bar Charts**: For comparing metrics across categories
2. **Line Charts**: For tracking seasonal patterns and trends
3. **Tabular Data**: For detailed numerical analysis and comparison

## Implementation Notes

This analytics system is designed to help pharmacy managers make data-driven decisions about:
- Inventory procurement
- Product mix optimization
- Pricing strategy
- Seasonal planning
- Loss prevention
- Profitability enhancement

The data is presented through an intuitive UI that allows for filtering and detailed exploration of specific metrics across different category groups.

## Future Enhancements

- Custom date range selection for historical analysis
- Export capabilities for reports
- Predictive analytics for demand forecasting
- Automated insights and recommendations
- Cost trend analysis
- Supplier performance metrics

The backend now provides two new API endpoints:
- `/inventory/analytics/subcategory`: Returns analytics data grouped by subcategory
- `/inventory/categories/structure`: Returns the complete category structure with relationships

The frontend uses this enhanced data to provide more detailed and hierarchical analytics visualizations.
