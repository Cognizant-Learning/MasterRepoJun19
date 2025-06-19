# Bank Account Operation Scenarios

This section outlines the valid scenarios for bank account operations in the migrated .NET Blazor Server application using an in-memory database.

## 1. View Account Balance

- **Scenario:** User views the current balance of their account.
- **Pre-condition:** User is authenticated and account exists.
- **Steps:**
  1. User navigates to the account dashboard.
  2. User selects the option to view balance.
- **Expected Result:** The application displays the current account balance.

## 2. Credit Account

- **Scenario:** User credits (deposits) a valid amount to their account.
- **Pre-condition:** User is authenticated and account exists.
- **Steps:**
  1. User selects the credit option.
  2. User enters a valid positive amount.
  3. User confirms the transaction.
- **Expected Result:** The application adds the amount to the balance, creates a credit transaction record, and displays the updated balance.

## 3. Credit Account with Invalid Amount

- **Scenario:** User attempts to credit a negative or non-numeric amount.
- **Pre-condition:** User is authenticated and account exists.
- **Steps:**
  1. User selects the credit option.
  2. User enters a negative or invalid amount.
  3. User attempts to confirm the transaction.
- **Expected Result:** The application displays an error message and does not update the balance.

## 4. Debit Account

- **Scenario:** User debits (withdraws) a valid amount from their account.
- **Pre-condition:** User is authenticated, account exists, and sufficient funds are available.
- **Steps:**
  1. User selects the debit option.
  2. User enters a valid amount less than or equal to the current balance.
  3. User confirms the transaction.
- **Expected Result:** The application subtracts the amount from the balance and displays the updated balance.

## 5. Debit Account with Insufficient Funds

- **Scenario:** User attempts to debit more than the available balance.
- **Pre-condition:** User is authenticated and account exists.
- **Steps:**
  1. User selects the debit option.
  2. User enters an amount greater than the current balance.
  3. User attempts to confirm the transaction.
- **Expected Result:** The application displays an "Insufficient funds" message and does not update the balance.

## 6. Debit Account with Invalid Amount

- **Scenario:** User attempts to debit a negative or non-numeric amount.
- **Pre-condition:** User is authenticated and account exists.
- **Steps:**
  1. User selects the debit option.
  2. User enters a negative or invalid amount.
  3. User attempts to confirm the transaction.
- **Expected Result:** The application displays an error message and does not update the balance.

## 7. View Transaction History

- **Scenario:** User views the history of account transactions.
- **Pre-condition:** User is authenticated and account exists.
- **Steps:**
  1. User navigates to the transaction history page.
- **Expected Result:** The application displays a list of all credit and debit transactions for the account.

---