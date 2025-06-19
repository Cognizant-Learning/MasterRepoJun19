describe('Banking App - Debit Operations', () => {
  beforeEach(() => {
    // Initialize account and load test data before each test
    cy.initializeAccount();
    cy.fixture('amounts').as('testData');
    
    // Visit the homepage
    cy.visit('/');
  });

  it('should debit the account with a valid amount', function() {
    const amount = this.testData.validDebitAmount;
    
    // Get the initial balance first
    let initialBalance = 0;
    cy.get('.card-title').invoke('text').then(text => {
      // Extract balance value from the text (removing $ and commas)
      initialBalance = parseFloat(text.replace(/[$,]/g, ''));
      
      // Enter debit amount
      cy.get('input[type="number"]')
        .clear()
        .type(amount);
      
      // Click the Debit Account button
      cy.contains('Debit Account').click();
      
      // Check for success message
      cy.contains('Debit successful').should('be.visible');
      
      // Calculate expected balance
      const expectedBalance = (initialBalance - amount).toFixed(2);
      
      // Check that balance decreased
      cy.get('.card-title')
        .invoke('text')
        .should('include', `$${expectedBalance}`);
    });
  });
  it('should not allow negative debit amounts', function() {
    const amount = this.testData.invalidAmount;
    
    // Get the initial balance first
    let initialBalance = 0;
    cy.get('.card-title').invoke('text').then(text => {
      // Extract balance value from the text (removing $ and commas)
      initialBalance = parseFloat(text.replace(/[$,]/g, ''));
      
      // Enter invalid debit amount
      cy.get('input[type="number"]')
        .clear()
        .type(amount);
      
      // Click the Debit Account button
      cy.contains('Debit Account').click();
      
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
  it('should not allow zero debit amounts', function() {
    // Get the initial balance first
    let initialBalance = 0;
    cy.get('.card-title').invoke('text').then(text => {
      // Extract balance value from the text (removing $ and commas)
      initialBalance = parseFloat(text.replace(/[$,]/g, ''));
      
      // Enter zero amount
      cy.get('input[type="number"]')
        .clear()
        .type('0');
      
      // Click the Debit Account button
      cy.contains('Debit Account').click();
      
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
  it('should not allow debiting more than the available balance', function() {
    // Get the current balance first
    cy.get('.card-title').invoke('text').then(text => {
      const currentBalance = parseFloat(text.replace(/[$,]/g, ''));
      
      // Calculate an amount that exceeds current balance
      const excessAmount = currentBalance + 100;
      
      // Enter amount greater than balance
      cy.get('input[type="number"]')
        .clear()
        .type(excessAmount);
      
      // Click the Debit Account button
      cy.contains('Debit Account').click();
      
      // Check for insufficient funds error
      cy.contains('Insufficient funds').should('be.visible');
      
      // Balance should remain unchanged - compare with the original value
      cy.get('.card-title')
        .invoke('text')
        .should(newText => {
          const newBalance = parseFloat(newText.replace(/[$,]/g, ''));
          expect(newBalance).to.equal(currentBalance);
        });
    });
  });
});
