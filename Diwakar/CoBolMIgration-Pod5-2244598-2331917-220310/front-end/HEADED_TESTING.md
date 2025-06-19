# Headed Cypress Testing

This document provides instructions on how to use the headed testing feature in Cypress for the Banking App.

## What is Headed Testing?

Headed testing runs Cypress tests in a visible browser window, allowing you to watch the test execution in real-time. This is useful for debugging and visualizing how your tests interact with the application.

## Available Scripts

We've added several scripts to package.json to support headed testing:

### Running All Tests in Headed Mode

```bash
npm run cypress:headed
# or
npm run test:e2e:headed
```

### Running Specific Test Files in Headed Mode

```bash
# API Tests
npm run test:api:headed

# UI/Visual Tests
npm run test:ui:headed

# Account Balance Tests
npm run test:balance:headed

# Credit Operation Tests
npm run test:credit:headed

# Debit Operation Tests
npm run test:debit:headed
```

## Tips for Headed Testing

1. **Slowing Down Tests**: If tests are running too fast to observe, you can add `cy.wait(1000)` commands at strategic points to slow down execution.

2. **Debugging**: If a test is failing, run it in headed mode to visually see what's happening when the failure occurs.

3. **Video Recordings**: All headed test runs will generate video recordings in the `cypress/videos` directory.

4. **Screenshots**: Screenshots of test failures will be stored in the `cypress/screenshots` directory.

## Configuration

The headed testing configuration is defined in `cypress.config.js` with the following settings:

- Viewport: 1280x720
- Video recording: Enabled
- Video compression: 32 (medium quality)
- Screenshots on failure: Enabled
- Automatic test retries: 1 retry in run mode, 0 in open mode

## Troubleshooting

If you encounter issues with headed testing:

1. Make sure both the frontend and backend servers are running
2. Check that the ports configured in cypress.env.json match your running servers
3. Try clearing the Cypress cache: `npx cypress cache clear`
4. If tests are flaky, consider adding additional wait times or more robust selectors

## When to Use Headed vs Headless Testing

- **Headed Testing**: Development, debugging, understanding test flow
- **Headless Testing**: CI/CD pipelines, performance testing, batch test runs
