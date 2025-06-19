# Editing Model and Chat History Format

## Code Block Format Guidelines

### File Modification Format
When modifying files, changes should be presented in the following format:

1. Group changes by file with file path as header
2. Provide a brief summary of changes
3. Use code blocks with four backticks
4. Include filepath comment on first line
5. Use `// ...existing code...` for unchanged sections

### Example Format
```
### c:\path\to\file

Description of changes

````languageId
// filepath: c:\path\to\file
// ...existing code...
{ modified code }
// ...existing code...
````
````

## Project Context
- Migration from COBOL banking application to .NET Blazor Server
- Using in-memory database for account operations
- Business logic implementation in C# and Blazor components
- Following original COBOL logic structure

## Working Environment
- Project Root: d:\Illuminati
- Target Framework: .NET 6.0 and .NET 9.0
- Testing: Python unittest framework
- Database: In-memory storage