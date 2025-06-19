// ***********************************************
// This commands.js file allows you to create custom commands and overwrite
// existing commands.
// ***********************************************

// -- Custom commands specific to our banking application --

// Command to initialize an account if needed
Cypress.Commands.add('initializeAccount', () => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/accounts/1`,
    failOnStatusCode: false
  }).then(response => {
    return response;
  });
});

// Command to get account balance
Cypress.Commands.add('getAccountBalance', (accountId = 1) => {
  cy.request({
    method: 'GET',
    url: `${Cypress.env('apiUrl')}/accounts/${accountId}`,
    failOnStatusCode: false
  }).then(response => {
    return response;
  });
});

// Command to credit account
Cypress.Commands.add('creditAccount', (amount, accountId = 1) => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/accounts/${accountId}/credit`,
    body: { amount },
    failOnStatusCode: false
  }).then(response => {
    return response;
  });
});

// Command to debit account
Cypress.Commands.add('debitAccount', (amount, accountId = 1) => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/accounts/${accountId}/debit`,
    body: { amount },
    failOnStatusCode: false
  }).then(response => {
    return response;
  });
});
