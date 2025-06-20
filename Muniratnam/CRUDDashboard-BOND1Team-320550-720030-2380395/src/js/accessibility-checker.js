// Accessibility verification script
// Run this in the browser console to check accessibility issues

function checkAccessibility() {
    console.group('Accessibility Check Results');
    
    // Check for basic accessibility attributes
    checkAriaAttributes();
    
    // Check for keyboard navigation
    checkKeyboardNavigation();
    
    // Check for proper focus management
    checkFocusManagement();
    
    // Check for screen reader support
    checkScreenReaderSupport();
    
    // Check for color contrast issues
    checkColorContrast();
    
    console.groupEnd();
    
    // Return summary
    return {
        message: "Accessibility check complete. See console for detailed results.",
        runOn: new Date().toISOString()
    };
}

// Check for required ARIA attributes
function checkAriaAttributes() {
    console.group('ARIA Attributes');
    
    // Check for form input labels
    const formInputs = document.querySelectorAll('input, select, textarea');
    let unlabeledInputs = 0;
    
    formInputs.forEach(input => {
        const id = input.id;
        if (id) {
            const hasLabel = document.querySelector(`label[for="${id}"]`);
            const hasAriaLabel = input.getAttribute('aria-label');
            const hasAriaLabelledBy = input.getAttribute('aria-labelledby');
            
            if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy) {
                console.warn(`Input missing label: ${id}`);
                unlabeledInputs++;
            }
        } else if (!input.hasAttribute('aria-label') && !input.hasAttribute('aria-labelledby')) {
            console.warn('Input with no ID and no aria-label', input);
            unlabeledInputs++;
        }
    });
    
    console.log(`${unlabeledInputs} inputs missing proper labels out of ${formInputs.length} total inputs`);
    
    // Check buttons for accessible names
    const buttons = document.querySelectorAll('button, [role="button"]');
    let unlabeledButtons = 0;
    
    buttons.forEach(button => {
        const hasText = button.textContent.trim().length > 0;
        const hasAriaLabel = button.getAttribute('aria-label');
        const hasAriaLabelledBy = button.getAttribute('aria-labelledby');
        
        if (!hasText && !hasAriaLabel && !hasAriaLabelledBy) {
            console.warn('Button with no accessible name', button);
            unlabeledButtons++;
        }
    });
    
    console.log(`${unlabeledButtons} buttons missing accessible names out of ${buttons.length} total buttons`);
    
    // Check for images without alt text
    const images = document.querySelectorAll('img');
    let missingAlt = 0;
    
    images.forEach(img => {
        if (!img.hasAttribute('alt')) {
            console.warn('Image missing alt text', img);
            missingAlt++;
        }
    });
    
    console.log(`${missingAlt} images missing alt text out of ${images.length} total images`);
    
    // Check for proper heading structure
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    const headingLevels = headings.map(h => parseInt(h.tagName.substring(1), 10));
    
    let skippedLevels = 0;
    for (let i = 0; i < headingLevels.length - 1; i++) {
        if (headingLevels[i+1] - headingLevels[i] > 1) {
            console.warn(`Skipped heading level: ${headingLevels[i]} to ${headingLevels[i+1]}`);
            skippedLevels++;
        }
    }
    
    console.log(`${skippedLevels} instances of skipped heading levels`);
    
    console.groupEnd();
}

// Check for keyboard navigation issues
function checkKeyboardNavigation() {
    console.group('Keyboard Navigation');
    
    // Check for positive tabindex values
    const elementsWithTabIndex = document.querySelectorAll('[tabindex]');
    let positiveTabIndices = 0;
    
    elementsWithTabIndex.forEach(el => {
        const tabIndex = parseInt(el.getAttribute('tabindex'), 10);
        if (tabIndex > 0) {
            console.warn(`Element with positive tabindex (${tabIndex})`, el);
            positiveTabIndices++;
        }
    });
    
    console.log(`${positiveTabIndices} elements with positive tabindex values out of ${elementsWithTabIndex.length} total elements with tabindex`);
    
    // Check for interactive elements inside buttons or links
    const buttons = document.querySelectorAll('button, a');
    let nestedInteractiveElements = 0;
    
    buttons.forEach(button => {
        const interactiveChildren = button.querySelectorAll('button, a, input, select, textarea');
        if (interactiveChildren.length > 0) {
            console.warn('Button/link with nested interactive elements', button);
            nestedInteractiveElements++;
        }
    });
    
    console.log(`${nestedInteractiveElements} buttons or links with nested interactive elements`);
    
    console.groupEnd();
}

// Check for focus management issues
function checkFocusManagement() {
    console.group('Focus Management');
    
    // Check if modals are trapping focus
    const modals = document.querySelectorAll('.modal');
    console.log(`${modals.length} modal dialogs detected`);
    
    // Check for hidden elements that can receive focus
    const hiddenElements = document.querySelectorAll(
        '[style*="display: none"]:not([tabindex="-1"]), ' +
        '[style*="visibility: hidden"]:not([tabindex="-1"]), ' +
        '[hidden]:not([tabindex="-1"])'
    );
    
    if (hiddenElements.length > 0) {
        console.warn(`${hiddenElements.length} hidden elements can receive focus`, hiddenElements);
    } else {
        console.log('No hidden elements that can receive focus');
    }
    
    console.groupEnd();
}

// Check for screen reader support
function checkScreenReaderSupport() {
    console.group('Screen Reader Support');
    
    // Check for ARIA live regions
    const liveRegions = document.querySelectorAll('[aria-live]');
    console.log(`${liveRegions.length} aria-live regions detected`);
    
    // Check for properly labeled form fields
    const formFields = document.querySelectorAll('input, select, textarea');
    let fieldsWithoutDescription = 0;
    
    formFields.forEach(field => {
        const hasDescription = field.getAttribute('aria-describedby');
        if (!hasDescription && field.type !== 'hidden' && field.type !== 'submit' && field.type !== 'button') {
            console.warn('Form field without description', field);
            fieldsWithoutDescription++;
        }
    });
    
    console.log(`${fieldsWithoutDescription} form fields without descriptions out of ${formFields.length} total fields`);
    
    console.groupEnd();
}

// Check for color contrast issues (limited detection)
function checkColorContrast() {
    console.group('Color Contrast');
    
    console.log('Note: Full color contrast checking requires specialized tools');
    console.log('Check light text on light backgrounds or dark text on dark backgrounds');
    
    // Check for elements that might have contrast issues when inverted
    const possibleContrastIssues = document.querySelectorAll(
        '.btn-outline-light, .btn-outline-dark, .text-white, .text-dark'
    );
    
    console.log(`${possibleContrastIssues.length} elements that might have contrast issues in different color schemes`);
    
    console.groupEnd();
}

// Run the check and return results
checkAccessibility();
