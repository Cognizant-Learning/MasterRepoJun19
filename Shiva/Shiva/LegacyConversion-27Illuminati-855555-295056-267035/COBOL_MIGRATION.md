# COBOL to .NET Blazor Migration

## Overview
This project is a migration of a COBOL banking application to a .NET 8 Blazor Server application. The new app uses an in-memory database and provides the same operations as the original COBOL code: view balance, credit, and debit.

## Original COBOL Logic
- **View Balance**: Reads and displays the current balance.
- **Credit**: Prompts for an amount, adds it to the balance, and displays the new balance.
- **Debit**: Prompts for an amount, subtracts it from the balance if sufficient funds exist, and displays the new balance or an error message.

## .NET Blazor Implementation
- Uses Blazor Server for the UI and C# for business logic.
- Stores account data in an in-memory singleton service.
- UI allows users to view, credit, and debit the account interactively.

## Mapping from COBOL to .NET
| COBOL Concept         | .NET Blazor Equivalent           |
|----------------------|----------------------------------|
| WORKING-STORAGE      | C# class fields / properties      |
| PROCEDURE DIVISION   | C# methods                        |
| DISPLAY              | Blazor UI rendering               |
| ACCEPT               | Blazor form input                 |
| CALL 'DataProgram'   | Service method call               |
| FINAL-BALANCE        | Property in service/model         |

### Step2
## Transaction Logging
- Record all account operations (credit, debit, balance inquiry) in an in-memory transaction log.
- Provide a way to view transaction history per account.
- Create new page and navigation to see history.


## Error Handling & Validation
- Display user-friendly error messages for invalid operations (e.g., insufficient funds).
- Validate all user inputs on both client and server sides.

## User Authentication & Authorization
- Implement secure login for users (bank staff or customers).
- Restrict access to account operations based on user roles.
- Add default user admin for bank saff and guest for customer

### Step 3
## Add Sign In and Sign Out Pages
- Create a dedicated Sign In page for user authentication.
- Create a Sign Out page or button for users to log out securely.
- Redirect users to the Sign In page if not authenticated.
- Show user-friendly messages on successful sign in/out or on authentication errors.
- Update navigation to include Sign In/Sign Out options based on authentication state.
