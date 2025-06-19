describe('Banking App - Edge Cases and Boundary Values', () => {
  beforeEach(() => {
    cy.initializeAccount();
    cy.visit('/');
  });

  it('should handle very large credit amounts', () => {
    const largeAmount = 9999999.99;
    
    // Enter a very large amount
    cy.get('input[type="number"]')
      .clear()
      .type(largeAmount);
    
    // Credit the large amount
    cy.contains('Credit Account').click();
    
    // Check for success or appropriate error
    cy.get('body').then($body => {
      if ($body.find('.alert-success').length) {
        // If operation succeeded
        cy.contains('Credit successful').should('be.visible');
        // Balance should reflect the large amount
        cy.get('.card-title').should('include.text', '$10,000,999.99');
      } else {
        // If there's a system limitation
        cy.get('.alert-danger').should('be.visible');
      }
    });
  });

  it('should handle decimal precision correctly', () => {
    // Credit with a precise decimal amount
    cy.get('input[type="number"]')
      .clear()
      .type('100.99');
    cy.contains('Credit Account').click();
    
    // Verify precise amount was added
    cy.get('.card-title').should('include.text', '$1100.99');
    
    // Debit with another precise decimal amount
    cy.get('input[type="number"]')
      .clear()
      .type('0.99');
    cy.contains('Debit Account').click();
    
    // Verify precise calculation
    cy.get('.card-title').should('include.text', '$1100.00');
  });

  it('should handle special characters and input validation', () => {
    // Try to enter non-numeric characters (browsers typically prevent this for number inputs)
    cy.get('input[type="number"]')
      .clear()
      .type('abc');
    
    // Input should be empty or only contain numbers
    cy.get('input[type="number"]').then($input => {
      expect($input.val()).to.match(/^[0-9]*\.?[0-9]*$/);
    });
    
    // Try with special characters
    cy.get('input[type="number"]')
      .clear()
      .type('!@#$%');
    
    // Input should be empty or only contain numbers
    cy.get('input[type="number"]').then($input => {
      expect($input.val()).to.match(/^[0-9]*\.?[0-9]*$/);
    });
  });

  it('should handle minimum and maximum input values', () => {
    // Try with zero (should be rejected)
    cy.get('input[type="number"]')
      .clear()
      .type('0');
    cy.contains('Credit Account').click();
    cy.contains('Please enter a valid amount').should('be.visible');
    
    // Try with a very small valid amount
    cy.get('input[type="number"]')
      .clear()
      .type('0.01');
    cy.contains('Credit Account').click();
    cy.contains('Credit successful').should('be.visible');
    cy.get('.card-title').should('include.text', '$1000.01');
    
    // Try with amount having more than 2 decimal places
    cy.get('input[type="number"]')
      .clear()
      .type('50.999');
    cy.contains('Debit Account').click();
    
    // Check how system handles it (should truncate or round to 2 decimal places)
    cy.get('body').then($body => {
      if ($body.find('.alert-success').length) {
        // Verify how the system handled the extra decimal place
        cy.get('.card-title').invoke('text').then(text => {
          const match = text.match(/\$([0-9]+\.[0-9]{2})/);
          if (match) {
            const actual = parseFloat(match[1]);
            // Should be either 949.01 (truncated) or 949.00 (rounded)
            expect(actual).to.be.oneOf([950.01, 949.01]);
          }
        });
      }
    });
  });
});
