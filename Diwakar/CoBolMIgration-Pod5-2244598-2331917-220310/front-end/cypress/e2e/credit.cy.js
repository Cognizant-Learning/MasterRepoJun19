describe('Banking App - Credit Operations', () => {
  beforeEach(() => {
    // Initialize account and load test data before each test
    cy.initializeAccount();
    cy.fixture('amounts').as('testData');
    
    // Visit the homepage
    cy.visit('/');
  });
  it('should credit the account with a valid amount', function() {
    const amount = this.testData.validCreditAmount;
    
    // Get the initial balance first
    let initialBalance = 0;
    cy.get('.card-title').invoke('text').then(text => {
      // Extract balance value from the text (removing $ and commas)
      initialBalance = parseFloat(text.replace(/[$,]/g, ''));
      
      // Enter credit amount
      cy.get('input[type="number"]')
        .clear()
        .type(amount);
      
      // Click the Credit Account button
      cy.contains('Credit Account').click();
      
      // Check for success message
      cy.contains('Credit successful').should('be.visible');
      
      // Calculate expected balance
      const expectedBalance = (initialBalance + amount).toFixed(2);
      
      // Check that balance increased
      cy.get('.card-title')
        .invoke('text')
        .should('include', `$${expectedBalance}`);
    });
  });
  it('should not allow negative credit amounts', function() {
    const amount = this.testData.invalidAmount;
    
    // Get the initial balance first
    let initialBalance = 0;
    cy.get('.card-title').invoke('text').then(text => {
      // Extract balance value from the text (removing $ and commas)
      initialBalance = parseFloat(text.replace(/[$,]/g, ''));
      
      // Enter invalid credit amount
      cy.get('input[type="number"]')
        .clear()
        .type(amount);
      
      // Click the Credit Account button
      cy.contains('Credit Account').click();
      
      // Check for error message
      cy.contains('Please enter a valid amount').should('be.visible');
      
      // Balance should remain unchanged - compare with the initial value
      cy.get('.card-title')
        .invoke('text')
        .should(newText => {
          const newBalance = parseFloat(newText.replace(/[$,]/g, ''));
          expect(newBalance).to.equal(initialBalance);
        });
    });
  });
  it('should not allow zero credit amounts', function() {
    // Get the initial balance first
    let initialBalance = 0;
    cy.get('.card-title').invoke('text').then(text => {
      // Extract balance value from the text (removing $ and commas)
      initialBalance = parseFloat(text.replace(/[$,]/g, ''));
      
      // Enter zero amount
      cy.get('input[type="number"]')
        .clear()
        .type('0');
      
      // Click the Credit Account button
      cy.contains('Credit Account').click();
      
      // Check for error message
      cy.contains('Please enter a valid amount').should('be.visible');
      
      // Balance should remain unchanged - compare with the initial value
      cy.get('.card-title')
        .invoke('text')
        .should(newText => {
          const newBalance = parseFloat(newText.replace(/[$,]/g, ''));
          expect(newBalance).to.equal(initialBalance);
        });
    });
  });
});
