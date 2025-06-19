const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    videoCompression: 32,
    screenshotOnRunFailure: true,
    watchForFileChanges: false,
  },
  env: {
    apiUrl: 'http://localhost:8080/api'
  },
  retries: {
    runMode: 1,
    openMode: 0
  }
});
