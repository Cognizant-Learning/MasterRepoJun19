# BankBlazorApp

This is a .NET Blazor Server application migrated from a COBOL banking system. It allows users to:
- View account balance
- Credit the account
- Debit the account (with insufficient funds check)

The application uses an in-memory database for demonstration purposes. All business logic is based on the original COBOL code.

## How to Run

1. Open a terminal in the `BankBlazorApp` directory.
2. Run the following command:

    dotnet run

3. Open your browser and go to `http://localhost:5000` (or the port shown in the terminal).

## Project Structure
- `COBOL_MIGRATION.md`: Mapping and documentation of the migration.
- `.github/copilot-instructions.md`: Copilot custom instructions for this workspace.
- Blazor components and services: To be implemented for account operations.

---
This README will be updated as the migration progresses.
