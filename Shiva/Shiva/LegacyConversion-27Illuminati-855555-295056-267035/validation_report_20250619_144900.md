# Migration Validation Report

Generated on: 2025-06-19 14:49:00

## Duplicate Records

### duplicate_accounts
- Account ID: 2, Balance: 2500.0

## Data Type Issues

### type_mismatches
- Record ID: 4, Field: balance, Expected: float, Found: str

## Record Count

- matches: False

- source_count: 3

- target_count: 4

## Value Mismatches

### mismatches
- ({'id': 3, 'balance': 150.0}, 'Missing in target')

## Null Values

### null_fields
- Transaction ID: 3, Null field: date

## Referential Integrity

### invalid_references
- Transaction ID: 2, Invalid Account ID: 5

## Business Logic Violations

### negative_balances

### invalid_transactions
- Transaction ID: 3, Amount: -50.0
