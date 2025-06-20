// Utility script to enhance forms accessibility
// This script should be loaded after accessibility-helper.js

document.addEventListener('DOMContentLoaded', () => {
    // Initialize form helpers
    initializeFormAccessibility();
    
    // Add event listeners for modals
    setupModalAccessibility();
});

// Initialize form accessibility features
function initializeFormAccessibility() {
    // Save original help text
    document.querySelectorAll('.form-text').forEach(helpText => {
        helpText.setAttribute('data-original-text', helpText.textContent);
    });
    
    // Make form labels more accessible
    document.querySelectorAll('form label').forEach(label => {
        const forId = label.getAttribute('for');
        if (forId) {
            const input = document.getElementById(forId);
            if (input) {
                // Ensure input has aria-labelledby
                if (!input.hasAttribute('aria-labelledby')) {
                    const labelId = `${forId}-label`;
                    label.id = labelId;
                    input.setAttribute('aria-labelledby', labelId);
                }
            }
        }
    });
    
    // Add keyboard listeners for button-like elements
    document.querySelectorAll('[role="button"]:not(button)').forEach(element => {
        element.setAttribute('tabindex', '0');
        element.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                element.click();
            }
        });
    });
    
    // Make form validation more accessible
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => {
            if (!form.checkValidity()) {
                e.preventDefault();
                
                // Find the first invalid field
                const firstInvalid = form.querySelector(':invalid');
                if (firstInvalid) {
                    firstInvalid.focus();
                    
                    // Announce error to screen reader
                    if (window.accessibilityHelper) {
                        const fieldName = document.querySelector(`label[for="${firstInvalid.id}"]`)?.textContent || 'Field';
                        accessibilityHelper.announce(`Error in ${fieldName}. Please check your input.`, 'assertive');
                    }
                }
            }
        });
    });
}

// Setup modal accessibility features
function setupModalAccessibility() {
    // Ensure modals restore focus when closed
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('hidden.bs.modal', () => {
            if (window.accessibilityHelper && accessibilityHelper.lastFocus) {
                setTimeout(() => {
                    accessibilityHelper.lastFocus.focus();
                }, 100);
            }
        });
        
        modal.addEventListener('shown.bs.modal', () => {
            // Focus the first input or button in the modal
            const firstFocusable = modal.querySelector('input, button:not(.btn-close), select, textarea');
            if (firstFocusable) {
                firstFocusable.focus();
            }
            
            // Announce modal opening
            const modalTitle = modal.querySelector('.modal-title')?.textContent;
            if (modalTitle && window.accessibilityHelper) {
                accessibilityHelper.announce(`${modalTitle} dialog opened`, 'assertive');
            }
        });
    });
    
    // Make modals keyboard navigable
    document.querySelectorAll('.modal button.btn-close').forEach(closeButton => {
        closeButton.setAttribute('aria-label', 'Close dialog');
    });
}
