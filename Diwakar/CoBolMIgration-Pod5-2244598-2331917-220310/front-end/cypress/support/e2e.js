// ***********************************************************
// This is a great place to put global configuration and
// behavior that modifies Cypress.
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Highlight elements being interacted with during headed testing
Cypress.on('command:start', (command) => {
  if (command.name === 'click' && command.args.length) {
    try {
      const selector = command.args[0].selector || command.args[0];
      if (selector && typeof selector === 'string') {
        Cypress.$(selector).css('border', '3px solid red')
                          .css('box-shadow', '0 0 10px rgba(255, 0, 0, 0.5)');
      }
    } catch (error) {
      // Silently fail if there's an error in the highlighting
    }
  }
});

// Visual delay for headed mode - makes it easier to see what's happening
if (Cypress.browser.isHeaded) {
  Cypress.config('defaultCommandTimeout', 8000);
  
  // Add a small delay between commands in headed mode
  const origOn = Cypress.Commands.origOn;
  Cypress.Commands.origOn = function(...args) {
    if (args[0] === 'command:enqueued' && Cypress.browser.isHeaded) {
      const originalCallback = args[1];
      args[1] = function(command) {
        if (command.get('name') !== 'wait' && !command.get('name').includes('screenshot')) {
          const delay = 500;
          originalCallback(command);
          cy.wait(delay, { log: false });
        } else {
          originalCallback(command);
        }
      };
    }
    return origOn.apply(this, args);
  };
}

// Alternatively you can use CommonJS syntax:
// require('./commands')
