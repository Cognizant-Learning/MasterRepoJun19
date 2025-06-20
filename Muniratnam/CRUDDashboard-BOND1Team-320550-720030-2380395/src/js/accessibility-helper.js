// Accessibility Helper for CRUD Dashboard
// This module provides accessibility enhancements to improve the user experience
// for users with disabilities or those using assistive technologies.

class AccessibilityHelper {
    constructor() {
        // Create a live region for announcements
        this.setupLiveRegion();
        
        // Setup keyboard navigation enhancements
        this.setupKeyboardNavigation();
        
        // Track focus trap in modals
        this.setupModalFocusTraps();
        
        // Setup focus management
        this.lastFocus = null;
    }
    
    setupLiveRegion() {
        // Create a live region for screen reader announcements
        const liveRegion = document.createElement('div');
        liveRegion.id = 'a11y-announcer';
        liveRegion.className = 'sr-only';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        document.body.appendChild(liveRegion);
    }
    
    announce(message, priority = 'polite') {
        // Announce a message to screen readers
        const liveRegion = document.getElementById('a11y-announcer');
        if (liveRegion) {
            liveRegion.setAttribute('aria-live', priority);
            
            // Clear the region first (hack to ensure repeated messages are announced)
            liveRegion.textContent = '';
            
            // Set the new message after a brief delay
            setTimeout(() => {
                liveRegion.textContent = message;
            }, 50);
        }
    }
    
    setupKeyboardNavigation() {
        // Make table headers more accessible with keyboard navigation
        document.querySelectorAll('th[data-sort]').forEach(th => {
            th.setAttribute('tabindex', '0');
            
            // Add keyboard event for sorting
            th.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    th.click(); // Trigger the click event
                    
                    // Update the aria-sort attribute
                    const currentSort = th.getAttribute('aria-sort');
                    const newSort = currentSort === 'ascending' ? 'descending' : 'ascending';
                    
                    // Reset all sorting indicators
                    document.querySelectorAll('th[data-sort]').forEach(header => {
                        header.setAttribute('aria-sort', 'none');
                    });
                    
                    // Set the new sort direction
                    th.setAttribute('aria-sort', newSort);
                    
                    // Announce the sort change
                    const columnName = th.textContent.trim();
                    this.announce(`Table sorted by ${columnName} in ${newSort} order`);
                }
            });
        });
        
        // Enhance action buttons accessibility
        document.addEventListener('click', (e) => {
            const target = e.target.closest('.action-btn');
            if (target) {
                const action = target.classList.contains('edit-btn') ? 'edit' : 
                              target.classList.contains('delete-btn') ? 'delete' : '';
                
                if (action && target.closest('tr')) {
                    const row = target.closest('tr');
                    const itemName = row.cells[0].textContent;
                    
                    if (action === 'edit') {
                        this.announce(`Editing item: ${itemName}`);
                        this.lastFocus = target; // Remember last focus position
                    } else if (action === 'delete') {
                        this.announce(`Confirming deletion of item: ${itemName}`);
                        this.lastFocus = target; // Remember last focus position
                    }
                }
            }
        });
    }
    
    setupModalFocusTraps() {
        // Setup focus traps for all modals
        const modals = ['addItemModal', 'editItemModal', 'deleteConfirmModal'];
        
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (!modal) return;
            
            modal.addEventListener('shown.bs.modal', () => {
                this.trapFocus(modal);
            });
            
            modal.addEventListener('hidden.bs.modal', () => {
                this.restoreFocus();
            });
        });
    }
    
    trapFocus(element) {
        // Get all focusable elements
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        // Focus the first element
        firstElement.focus();
        
        // Add keydown event to trap focus
        element.addEventListener('keydown', function(e) {
            if (e.key !== 'Tab') return;
            
            if (e.shiftKey) {
                // Shift + Tab: if on first element, go to last
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                // Tab: if on last element, go to first
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }
    
    restoreFocus() {
        // Restore focus to the last focused element
        if (this.lastFocus && document.contains(this.lastFocus)) {
            this.lastFocus.focus();
        }
    }
    
    // Enhance data table accessibility
    enhanceDataTableAccessibility(tableId) {
        const table = document.getElementById(tableId);
        if (!table) return;
        
        // Add appropriate ARIA roles
        table.setAttribute('role', 'grid');
        
        // Ensure all headers have appropriate scope
        table.querySelectorAll('thead th').forEach(th => {
            th.setAttribute('scope', 'col');
            
            // Make sortable headers more accessible
            if (th.dataset.sort) {
                th.setAttribute('aria-sort', 'none');
                th.setAttribute('role', 'columnheader');
                
                // Add button-like appearance for keyboard users
                th.setAttribute('tabindex', '0');
            }
        });
        
        // Ensure table rows are properly marked up
        table.querySelectorAll('tbody tr').forEach(tr => {
            tr.setAttribute('role', 'row');
        });
    }
    
    // Enhance search accessibility
    enhanceSearchAccessibility(searchId) {
        const search = document.getElementById(searchId);
        if (!search) return;
        
        // Ensure search has appropriate label
        if (!search.hasAttribute('aria-label')) {
            search.setAttribute('aria-label', 'Search inventory');
        }
    }
    
    // Update status of sort headers
    updateSortHeaderStatus(sortKey, ascending) {
        document.querySelectorAll('th[data-sort]').forEach(header => {
            if (header.dataset.sort === sortKey) {
                header.setAttribute('aria-sort', ascending ? 'ascending' : 'descending');
                this.announce(`Table sorted by ${header.textContent.trim()} in ${ascending ? 'ascending' : 'descending'} order`);
            } else {
                header.setAttribute('aria-sort', 'none');
            }
        });
    }
      // Announce CRUD operations
    announceCrudOperation(operation, itemName) {
        let message = '';
        
        switch (operation) {
            case 'create':
                message = `Item ${itemName} has been created successfully.`;
                break;
            case 'update':
                message = `Item ${itemName} has been updated successfully.`;
                break;
            case 'delete':
                message = `Item ${itemName} has been deleted successfully.`;
                break;
            default:
                message = `Item ${itemName} has been processed.`;
        }
        
        this.announce(message);
    }
    
    // Announce loading state
    announceLoading(isLoading, context = 'data') {
        if (isLoading) {
            this.announce(`Loading ${context}. Please wait.`);
        } else {
            this.announce(`${context} loaded successfully.`);
        }
    }
    
    // Handle form validation errors
    handleFormErrors(form) {
        if (!form) return false;
        
        const invalidFields = [];
        let firstInvalidField = null;
        
        // Find all invalid fields
        form.querySelectorAll('[required], [aria-required="true"]').forEach(field => {
            if (!field.checkValidity()) {
                field.classList.add('is-invalid');
                
                // Get field name from label
                const fieldName = document.querySelector(`label[for="${field.id}"]`)?.textContent || field.id;
                invalidFields.push(fieldName);
                
                // Store first invalid field for focus
                if (!firstInvalidField) {
                    firstInvalidField = field;
                }
                
                // Add help text
                const helpId = field.getAttribute('aria-describedby');
                if (helpId) {
                    const helpText = document.getElementById(helpId);
                    if (helpText) {
                        // Store original help text if not already stored
                        if (!helpText.hasAttribute('data-original-text')) {
                            helpText.setAttribute('data-original-text', helpText.textContent);
                        }
                        
                        // Change help text to error message
                        helpText.classList.add('text-danger');
                        helpText.textContent = `${fieldName} is required and cannot be empty`;
                    }
                }
                
                // Add reset on input
                field.addEventListener('input', function() {
                    if (this.checkValidity()) {
                        this.classList.remove('is-invalid');
                        
                        // Restore original help text
                        const helpId = this.getAttribute('aria-describedby');
                        if (helpId) {
                            const helpText = document.getElementById(helpId);
                            if (helpText && helpText.hasAttribute('data-original-text')) {
                                helpText.classList.remove('text-danger');
                                helpText.textContent = helpText.getAttribute('data-original-text');
                            }
                        }
                    }
                }, { once: true });
            }
        });
        
        // If we found invalid fields, announce them and focus the first one
        if (invalidFields.length > 0) {
            this.announce(`Form has ${invalidFields.length} validation errors. ${invalidFields.join(', ')} ${invalidFields.length > 1 ? 'are' : 'is'} required.`, 'assertive');
            
            if (firstInvalidField) {
                setTimeout(() => firstInvalidField.focus(), 100);
            }
            
            return false;
        }
        
        return true;
    }
}

// Initialize the accessibility helper
let accessibilityHelper;
document.addEventListener('DOMContentLoaded', () => {
    accessibilityHelper = new AccessibilityHelper();
    
    // Make globally available
    window.accessibilityHelper = accessibilityHelper;
    
    // Enhance core elements
    accessibilityHelper.enhanceDataTableAccessibility('inventoryTable');
    accessibilityHelper.enhanceSearchAccessibility('searchInput');
});
