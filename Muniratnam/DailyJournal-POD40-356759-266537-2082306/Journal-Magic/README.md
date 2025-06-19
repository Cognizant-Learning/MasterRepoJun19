# Journal Magic

A comprehensive journal and mood tracking application that helps users record their thoughts and analyze their mood patterns over time.

## Features

- Secure user authentication with JWT
- Intuitive journal entry interface
- Emoji-based and slider-based mood selection
- Calendar view for easy navigation of past entries
- Dark/light mode options
- Mood trend analysis and visualization
- Responsive design for web and mobile devices
- Chatbot welcome assistant

## Project Structure

- `/client` - Angular front-end application
- `/api` - Backend API and database
- `/testing` - Testing frameworks for UI, API, and automation

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- Angular CLI
- .NET SDK 6.0 or later (for API)

### Installation

We've created convenience scripts to make setup and running the application easy:

#### Using Convenience Scripts (Recommended)

1. Clone the repository
2. Run the setup script:
   ```
   cd Journal-Magic
   ./setup.ps1
   ```
   This will install all necessary dependencies for both the client and API components.

#### Manual Setup

1. Set up the client application:
   ```
   cd Journal-Magic/client
   npm install
   ```
2. Set up the API:
   ```
   cd Journal-Magic/api
   dotnet restore
   ```

### Running the Application

#### Using Convenience Script (Recommended)

1. Run the application using the run script:
   ```
   cd Journal-Magic
   ./run.ps1
   ```
   This will start both the API and client servers and open the application in your browser.

#### Manual Startup

1. Start the API server:
   ```
   cd Journal-Magic/api
   dotnet run
   ```

2. Start the Angular application (in a separate terminal):
   ```
   cd Journal-Magic/client
   ng serve
   ```

3. Access the application at `http://localhost:4200`

## Testing

The application includes comprehensive test suites for all components:

### Using the Test Runner Script

Run all tests at once using the test runner script:
```
cd Journal-Magic/testing
./run-tests.ps1
```

### Running Individual Test Suites

- Run Angular UI tests:
  ```
  cd Journal-Magic/client
  ng test
  ```

- Run API tests:
  ```
  cd Journal-Magic/testing/api
  dotnet test
  ```

- Run Selenium Automation tests:
  ```
  cd Journal-Magic/testing/automation
  dotnet test
  ```

See the `/testing/README.md` file for more details about the testing framework.
