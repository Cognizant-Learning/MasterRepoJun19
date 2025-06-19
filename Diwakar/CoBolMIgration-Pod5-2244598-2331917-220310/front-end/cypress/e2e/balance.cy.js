describe('Banking App - Account Balance', () => {
  beforeEach(() => {
    // Initialize account before each test
    cy.initializeAccount();
    
    // Visit the homepage
    cy.visit('/');
  });

  it('should display the account balance', () => {
    // Verify the account balance is displayed
    cy.contains('Account Balance').should('be.visible');
    
    // Balance should be visible and formatted as currency
    cy.get('.card-title')
      .should('be.visible')
      .contains('$');
  });
  it('should display the initial balance correctly', () => {
    // Get the account balance from the API
    cy.getAccountBalance().then(response => {
      // Ensure the request was successful
      expect(response.status).to.equal(200);
      
      // Extract the balance from the API response
      const apiBalance = parseFloat(response.body.balance).toFixed(2);
      
      // Check if the displayed balance matches the balance from the API
      cy.get('.card-title')
        .invoke('text')
        .then(text => {
          const displayedBalance = parseFloat(text.replace(/[$,]/g, '')).toFixed(2);
          expect(displayedBalance).to.equal(apiBalance);
        });
    });
  });
});
