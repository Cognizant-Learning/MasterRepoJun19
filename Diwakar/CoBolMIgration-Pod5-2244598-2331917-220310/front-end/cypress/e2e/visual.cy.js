describe('Banking App - UI Visual Tests', () => {
  beforeEach(() => {
    cy.initializeAccount();
    cy.visit('/');
  });

  it('should display the main UI components correctly', () => {
    // Check navbar exists
    cy.get('.navbar').should('be.visible');
    cy.get('.navbar-brand').should('contain', 'Banking Management System');
    
    // Check account balance component
    cy.get('.card-header').should('contain', 'Account Balance');
    cy.get('.card-title').should('be.visible');
    
    // Check transaction form elements
    cy.get('form').within(() => {
      cy.get('input[type="number"]').should('be.visible');
      cy.contains('button', 'Credit Account').should('be.visible').and('have.class', 'btn-success');
      cy.contains('button', 'Debit Account').should('be.visible').and('have.class', 'btn-warning');
    });
  });

  it('should display success alerts with correct styling', () => {
    // Perform a credit operation
    cy.get('input[type="number"]').clear().type('100');
    cy.contains('Credit Account').click();
    
    // Check success alert styling
    cy.get('.alert-success')
      .should('be.visible')
      .and('have.css', 'background-color', 'rgb(212, 237, 218)')
      .and('contain', 'Credit successful');
  });

  it('should display error alerts with correct styling', () => {
    // Attempt an invalid operation
    cy.get('input[type="number"]').clear().type('5000');
    cy.contains('Debit Account').click();
    
    // Check error alert styling
    cy.get('.alert-danger')
      .should('be.visible')
      .and('have.css', 'background-color', 'rgb(248, 215, 218)')
      .and('contain', 'Insufficient funds');
  });

  it('should have responsive layout on different viewports', () => {
    // Test on mobile viewport
    cy.viewport('iphone-6');
    cy.get('.col-md-6').should('be.visible');
    cy.get('input[type="number"]').should('be.visible');
    
    // Test on tablet viewport
    cy.viewport('ipad-2');
    cy.get('.col-md-6').should('be.visible');
    
    // Test on desktop viewport
    cy.viewport(1200, 800);
    cy.get('.col-md-6').should('be.visible');
  });
});
