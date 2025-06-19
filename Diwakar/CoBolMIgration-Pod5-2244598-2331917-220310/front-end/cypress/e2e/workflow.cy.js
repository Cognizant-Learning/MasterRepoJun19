describe('Banking App - End-to-End Workflow', () => {
  beforeEach(() => {
    // Initialize account before each test
    cy.initializeAccount();
    
    // Visit the homepage
    cy.visit('/');
  });
  it('should complete a full banking workflow: view balance → credit → debit', () => {
    // Step 1: Get initial balance
    let initialBalance = 0;
    cy.get('.card-title').invoke('text').then(text => {
      initialBalance = parseFloat(text.replace(/[$,]/g, ''));
      
      // Step 2: Credit the account
      const creditAmount = 250.75;
      cy.get('input[type="number"]')
        .clear()
        .type(creditAmount);
      cy.contains('Credit Account').click();
      
      // Verify credit success and new balance
      cy.contains('Credit successful').should('be.visible');
      
      const expectedBalanceAfterCredit = (initialBalance + creditAmount).toFixed(2);
      cy.get('.card-title')
        .invoke('text')
        .should(text => {
          const actualBalance = parseFloat(text.replace(/[$,]/g, '')).toFixed(2);
          expect(actualBalance).to.equal(expectedBalanceAfterCredit);
        });
        
      // Step 3: Debit the account
      const debitAmount = 150.25;
      cy.get('input[type="number"]')
        .clear()
        .type(debitAmount);
      cy.contains('Debit Account').click();
      
      // Verify debit success and final balance
      cy.contains('Debit successful').should('be.visible');
      
      const expectedFinalBalance = (parseFloat(expectedBalanceAfterCredit) - debitAmount).toFixed(2);
      cy.get('.card-title')
        .invoke('text')
        .should(text => {
          const actualBalance = parseFloat(text.replace(/[$,]/g, '')).toFixed(2);
          expect(actualBalance).to.equal(expectedFinalBalance);
        });
    });
  });
  it('should handle errors correctly throughout the workflow', () => {
    // Get initial balance
    let initialBalance = 0;
    cy.get('.card-title').invoke('text').then(text => {
      initialBalance = parseFloat(text.replace(/[$,]/g, ''));
      
      // Attempt to debit with an amount greater than the balance
      const excessAmount = initialBalance + 500;
      cy.get('input[type="number"]')
        .clear()
        .type(excessAmount);
      cy.contains('Debit Account').click();
      
      // Verify insufficient funds error
      cy.contains('Insufficient funds').should('be.visible');
      
      // Verify balance remains unchanged
      cy.get('.card-title')
        .invoke('text')
        .should(newText => {
          const newBalance = parseFloat(newText.replace(/[$,]/g, ''));
          expect(newBalance).to.equal(initialBalance);
        });
        
      // Now credit a valid amount
      const creditAmount = 200;
      cy.get('input[type="number"]')
        .clear()
        .type(creditAmount);
      cy.contains('Credit Account').click();
      
      // Verify successful credit
      cy.contains('Credit successful').should('be.visible');
      
      const expectedBalanceAfterCredit = (initialBalance + creditAmount).toFixed(2);
      cy.get('.card-title')
        .invoke('text')
        .should(text => {
          const actualBalance = parseFloat(text.replace(/[$,]/g, '')).toFixed(2);
          expect(actualBalance).to.equal(expectedBalanceAfterCredit);
        });
        
      // Try an invalid amount (negative)
      cy.get('input[type="number"]')
        .clear()
        .type('-50');
      cy.contains('Debit Account').click();
      
      // Verify error message for invalid amount
      cy.contains('Please enter a valid amount').should('be.visible');
      
      // Balance should remain unchanged
      cy.get('.card-title')
        .invoke('text')
        .should(text => {
          const actualBalance = parseFloat(text.replace(/[$,]/g, '')).toFixed(2);
          expect(actualBalance).to.equal(expectedBalanceAfterCredit);
        });
    });
  });
  it('should properly refresh balance after transactions', () => {
    // Get initial balance
    let initialBalance = 0;
    let expectedBalance = 0;
    
    cy.get('.card-title').invoke('text').then(text => {
      initialBalance = parseFloat(text.replace(/[$,]/g, ''));
      expectedBalance = initialBalance;
      
      // 1. Credit 100
      const creditAmount1 = 100;
      expectedBalance += creditAmount1;
      
      cy.get('input[type="number"]')
        .clear()
        .type(creditAmount1);
      cy.contains('Credit Account').click();
      cy.contains('Credit successful').should('be.visible');
      
      cy.get('.card-title')
        .invoke('text')
        .should(text => {
          const actualBalance = parseFloat(text.replace(/[$,]/g, '')).toFixed(2);
          expect(actualBalance).to.equal(expectedBalance.toFixed(2));
        });
      
      // 2. Credit another 150
      const creditAmount2 = 150;
      expectedBalance += creditAmount2;
      
      cy.get('input[type="number"]')
        .clear()
        .type(creditAmount2);
      cy.contains('Credit Account').click();
      cy.contains('Credit successful').should('be.visible');
      
      cy.get('.card-title')
        .invoke('text')
        .should(text => {
          const actualBalance = parseFloat(text.replace(/[$,]/g, '')).toFixed(2);
          expect(actualBalance).to.equal(expectedBalance.toFixed(2));
        });
      
      // 3. Debit 200
      const debitAmount = 200;
      expectedBalance -= debitAmount;
      
      cy.get('input[type="number"]')
        .clear()
        .type(debitAmount);
      cy.contains('Debit Account').click();
      cy.contains('Debit successful').should('be.visible');
      
      cy.get('.card-title')
        .invoke('text')
        .should(text => {
          const actualBalance = parseFloat(text.replace(/[$,]/g, '')).toFixed(2);
          expect(actualBalance).to.equal(expectedBalance.toFixed(2));
        });
        
      // Store the expected balance for after reload
      const finalExpectedBalance = expectedBalance.toFixed(2);
        
      // Refresh the page and check if balance persists
      cy.reload();
      cy.get('.card-title')
        .invoke('text')
        .should(text => {
          const actualBalance = parseFloat(text.replace(/[$,]/g, '')).toFixed(2);
          expect(actualBalance).to.equal(finalExpectedBalance);
        });
    });
  });
});
