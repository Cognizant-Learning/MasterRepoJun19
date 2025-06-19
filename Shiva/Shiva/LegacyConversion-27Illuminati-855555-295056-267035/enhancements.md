# Migration Validation Enhancements

This document lists recommended validation checks for your COBOL-to-.NET Blazor Server banking application migration. These checks help ensure data integrity, consistency, and business logic correctness after migration.

## 1. Duplicate Record Check
- **Scenario:** Ensure no duplicate account or transaction records exist after migration.
- **How to Validate:**
  - Check that each account has a unique identifier.
  - Check that each transaction (if using a unique ID or timestamp) is not duplicated.

## 2. Data Type Consistency Check
- **Scenario:** Ensure all fields have the correct data types after migration.
- **How to Validate:**
  - Account balances and transaction amounts should be decimal or float, not string or integer.
  - Dates should be stored as DateTime, not as string.
  - IDs should be integer or GUID as appropriate.

## 3. Record Count Validation
- **Scenario:** Ensure the number of records (accounts, transactions) matches between the COBOL source and the .NET target.
- **How to Validate:**
  - Compare the count of accounts and transactions before and after migration.

## 4. Data Value Mismatch Check
- **Scenario:** Ensure migrated data values match the source system.
- **How to Validate:**
  - For each account, verify the balance matches the COBOL system.
  - For each transaction, verify the amount, type (credit/debit), and date match the source.

## 5. Null or Missing Data Check
- **Scenario:** Ensure no required fields are null or missing after migration.
- **How to Validate:**
  - Check that all accounts have non-null IDs and balances.
  - Check that all transactions have non-null amounts, types, and dates.

## 6. Referential Integrity Check
- **Scenario:** Ensure all transactions reference valid accounts.
- **How to Validate:**
  - For each transaction, verify the associated account exists.

## 7. Business Logic Consistency
- **Scenario:** Ensure business rules (e.g., no negative balances, no overdrafts unless allowed) are enforced post-migration.
- **How to Validate:**
  - Attempt operations that should fail (e.g., overdraft, negative credit) and confirm the system rejects them.

---
Automate these checks with scripts or unit tests where possible, and use reports to compare pre- and post-migration data.
