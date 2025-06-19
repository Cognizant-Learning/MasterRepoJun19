# README.md

# Test Framework Setup

This project is set up to use Selenium WebDriver with TestNG for testing the Daily Journal application. Below are the instructions to set up and run the test framework.

## Project Structure

- `pom.xml`: Contains dependencies for Selenium WebDriver, TestNG, and other necessary libraries.
- `src/main/java/com/dailyjournal/pages/LoginPage.java`: Skeleton for the Page Object Model for the login page.
- `src/main/java/com/dailyjournal/utils/WebDriverFactory.java`: Manages WebDriver instances.
- `src/main/java/com/dailyjournal/utils/ConfigReader.java`: Reads configuration properties from `config.properties`.
- `src/main/resources/config.properties`: Holds configuration settings such as the application URL and browser settings.
- `src/test/java/com/dailyjournal/tests/LoginTest.java`: Skeleton for the TestNG test class for login functionality.
- `src/test/resources/testng.xml`: Configures TestNG test execution.

## Dependencies

Ensure you have the following dependencies in your `pom.xml`:

- Selenium WebDriver
- TestNG

## Running Tests

1. Ensure you have Maven installed.
2. Navigate to the `testing` directory.
3. Run the following command to execute the tests:

```
mvn test
```

This will compile the project and run the TestNG tests defined in `LoginTest.java`.