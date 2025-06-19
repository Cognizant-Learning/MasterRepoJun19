describe('Banking API - Direct API Tests', () => {
  let accountId;

  before(() => {
    // Initialize an account for testing
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/accounts/initialize`
    }).then((response) => {
      expect(response.status).to.eq(200);
      accountId = response.body.id;
    });
  });

  it('should get account balance via API', () => {
    cy.request({
      method: 'GET',
      url: `${Cypress.env('apiUrl')}/accounts/${accountId}`
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('balance');
      expect(response.body).to.have.property('message');
      expect(response.body.balance).to.eq(1000.00);
    });
  });

  it('should credit account via API', () => {
    const creditAmount = 300.50;
    
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/accounts/${accountId}/credit`,
      body: { amount: creditAmount }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('balance');
      expect(response.body.balance).to.eq(1300.50);
      expect(response.body.message).to.include('Amount credited');
    });
    
    // Verify balance was updated
    cy.request({
      method: 'GET',
      url: `${Cypress.env('apiUrl')}/accounts/${accountId}`
    }).then((response) => {
      expect(response.body.balance).to.eq(1300.50);
    });
  });

  it('should debit account via API', () => {
    const debitAmount = 200.25;
    
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/accounts/${accountId}/debit`,
      body: { amount: debitAmount }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('balance');
      expect(response.body.balance).to.eq(1100.25); // 1300.50 - 200.25
      expect(response.body.message).to.include('Amount debited');
    });
    
    // Verify balance was updated
    cy.request({
      method: 'GET',
      url: `${Cypress.env('apiUrl')}/accounts/${accountId}`
    }).then((response) => {
      expect(response.body.balance).to.eq(1100.25);
    });
  });

  it('should return error when debiting more than available balance', () => {
    const excessiveAmount = 5000;
    
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/accounts/${accountId}/debit`,
      body: { amount: excessiveAmount },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('error');
      expect(response.body.error).to.include('Insufficient funds');
    });
    
    // Verify balance remains unchanged
    cy.request({
      method: 'GET',
      url: `${Cypress.env('apiUrl')}/accounts/${accountId}`
    }).then((response) => {
      expect(response.body.balance).to.eq(1100.25); // Same as after previous test
    });
  });
});
