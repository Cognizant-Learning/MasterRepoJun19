# Journal Magic - Testing Framework

This folder contains all the testing frameworks and tests for the Journal Magic application, organized into three main categories:

1. **UI Tests**: Angular component and service tests
2. **API Tests**: Backend controller and service tests
3. **Automation Tests**: End-to-end tests using Selenium

## Test Categories

### UI Tests (Angular)

The UI tests are implemented using Jasmine and Karma, which are the default testing tools for Angular applications. These tests focus on validating the behavior of individual components, services, and other elements of the Angular application.

Key test files:
- `client/src/app/pages/login/login.component.spec.ts` - Tests for the login component
- `client/src/app/services/journal.service.spec.ts` - Tests for the journal service
- `client/src/app/components/mood-visualization/mood-visualization.component.spec.ts` - Tests for mood visualization

To run UI tests:
```powershell
cd Journal-Magic/client
ng test
```

For CI/CD pipelines or one-time execution:
```powershell
ng test --watch=false
```

### API Tests (.NET)

The API tests are implemented using xUnit and focus on testing the backend controllers, services, and other components of the .NET API.

Key test files:
- `testing/api/JournalControllerTests.cs` - Tests for the journal controller
- `testing/api/AuthControllerTests.cs` - Tests for the authentication controller
- `testing/api/MoodControllerTests.cs` - Tests for the mood analysis controller

To run API tests:
```powershell
cd Journal-Magic/testing/api
dotnet test
```

### Automation Tests (Selenium)

The automation tests use Selenium WebDriver to perform end-to-end testing of the application, simulating user interactions with the UI and validating the complete flow.

Key test file:
- `testing/automation/JournalMagicAutomationTests.cs` - End-to-end tests for key user journeys

To run automation tests:
```powershell
cd Journal-Magic/testing/automation
dotnet test
```

⚠️ Note: Automation tests are marked with `[Fact(Skip = "Run only when dev server is available")]` by default to avoid failures in CI/CD pipelines where a running application instance may not be available. Remove the Skip parameter to run these tests locally when your application is running.

## Running All Tests

A PowerShell script is provided to run all tests in sequence:

```powershell
cd Journal-Magic/testing
./run-tests.ps1
```

This script will run UI tests, API tests, and automation tests, and provide a summary of the results.

## Test Coverage

The tests aim to cover:

1. **Authentication** - Login, registration, and JWT token handling
2. **Journal Entries** - Creating, retrieving, updating, and deleting journal entries
3. **Mood Analysis** - Visualization, statistics, and correlations
4. **UI Components** - Correct rendering and behavior of UI elements
5. **End-to-End Flows** - Complete user journeys from login to journal entry and analysis

## Adding New Tests

### UI Tests
1. Create a `.spec.ts` file alongside the component or service you want to test
2. Import necessary testing utilities from Angular
3. Follow the existing test patterns for consistency

### API Tests
1. Add new test classes in the `testing/api` folder
2. Use dependency injection and mocking (Moq) to isolate the component being tested
3. Follow AAA pattern (Arrange, Act, Assert) for clear test structure

### Automation Tests
1. Add new test methods to `JournalMagicAutomationTests.cs` or create new test classes
2. Use Selenium WebDriver to simulate user interactions
3. Make sure to handle proper waits and synchronization

## Continuous Integration

The test suite is designed to be run in a CI/CD pipeline. The following considerations have been made:
- Angular tests can run in headless mode
- Selenium tests can run with headless browsers
- The test runner script provides clear exit codes for pipeline integration
