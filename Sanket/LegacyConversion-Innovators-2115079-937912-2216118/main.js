/**
 * main.js - Main application entry point and UI controller
 * Corresponds to MainProgram (main.cob) in the original COBOL application
 */

// DOM elements
const entryScreen = document.getElementById('entry-screen');
const startBtn = document.getElementById('start-btn');
const balanceAmount = document.getElementById('balance-amount');
const amountInput = document.getElementById('amount');
const creditBtn = document.getElementById('credit-btn');
const debitBtn = document.getElementById('debit-btn');
const viewBalanceBtn = document.getElementById('view-balance-btn');
const exitBtn = document.getElementById('exit-btn');
const clearHistoryBtn = document.getElementById('clear-history-btn');
const messageDiv = document.getElementById('message');
const historyList = document.getElementById('history-list');

// Initialize the application
function initApp() {
    // Set up entry screen listener
    startBtn.addEventListener('click', startApplication);
    
    // Update balance value (but it will be hidden)
    updateBalanceDisplay();
    
    // Load transaction history
    updateTransactionHistory();
      // Set up event listeners
    creditBtn.addEventListener('click', handleCredit);
    debitBtn.addEventListener('click', handleDebit);
    viewBalanceBtn.addEventListener('click', handleViewBalance);
    exitBtn.addEventListener('click', handleExit);
    clearHistoryBtn.addEventListener('click', handleClearHistory);
    
    // Reset input and message on input change
    amountInput.addEventListener('input', () => {
        messageDiv.className = 'message';
        messageDiv.textContent = '';
    });
}

// Start application by hiding entry screen
function startApplication() {
    entryScreen.classList.add('hidden');
    setTimeout(() => {
        entryScreen.style.display = 'none';
    }, 500);
}

// Update the balance display with the current balance
function updateBalanceDisplay() {
    const balance = operations.getBalance();
    balanceAmount.textContent = `$${balance.toFixed(2)}`;
}

// Handle credit (deposit) operation
function handleCredit() {
    const amount = parseFloat(amountInput.value);
    const result = operations.creditAccount(amount);
    
    // Create custom message without showing balance
    let message = result.success ? 
        "Amount credited successfully." : 
        result.message;
    
    // Display result
    displayMessage(result.success, message);
    
    // Update UI
    if (result.success) {
        updateBalanceDisplay();
        updateTransactionHistory();
        amountInput.value = '';
    }
}

// Handle debit (withdrawal) operation
function handleDebit() {
    const amount = parseFloat(amountInput.value);
    const result = operations.debitAccount(amount);
    
    // Create custom message without showing balance
    let message = result.success ? 
        "Amount debited successfully." : 
        result.message;
    
    // Display result
    displayMessage(result.success, message);
    
    // Update UI
    if (result.success) {
        updateBalanceDisplay();
        updateTransactionHistory();
        amountInput.value = '';
    }
}

// Handle clear history button click
function handleClearHistory() {
    if (confirm('Are you sure you want to clear all transaction history?')) {
        // Clear transaction history in data layer
        dataProgram.clearTransactionHistory();
        
        // Update UI
        updateTransactionHistory();
        
        // Show confirmation message
        displayMessage(true, "Transaction history cleared successfully.");
    }
}

// Handle exit button click
function handleExit() {
    const confirmExit = confirm('Are you sure you want to exit the application?');
    
    if (confirmExit) {
        // Try standard close method first
        window.close();
        
        // If we're still here, try alternative methods
        // This works for some browsers like Firefox
        window.open('', '_self').close();
        
        // For Chrome and other browsers that don't allow scripts to close windows
        // that weren't opened by scripts, show a message
        const exitScreen = document.createElement('div');
        exitScreen.style.position = 'fixed';
        exitScreen.style.top = '0';
        exitScreen.style.left = '0';
        exitScreen.style.width = '100%';
        exitScreen.style.height = '100%';
        exitScreen.style.backgroundColor = 'white';
        exitScreen.style.zIndex = '10000';
        exitScreen.style.display = 'flex';
        exitScreen.style.flexDirection = 'column';
        exitScreen.style.alignItems = 'center';
        exitScreen.style.justifyContent = 'center';
        
        exitScreen.innerHTML = `
            <h1 style="color: #2c3e50; margin-bottom: 20px;">Good Bye</h1>
            <p style="color: #7f8c8d; margin-bottom: 30px;">You may now close this tab.</p>
            <button id="restart-btn" style="background-color: #3498db; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Restart Application</button>
        `;
        
        document.body.appendChild(exitScreen);
        
        // Add event listener to restart button
        document.getElementById('restart-btn').addEventListener('click', function() {
            window.location.reload();
        });
    }
}

// Handle view balance button click
function handleViewBalance() {
    // Show balance and hide button
    balanceAmount.style.display = 'block';
    viewBalanceBtn.style.display = 'none';
    
    // Hide balance again after 5 seconds
    setTimeout(() => {
        balanceAmount.style.display = 'none';
        viewBalanceBtn.style.display = 'block';    }, 5000);
}

// Display operation message
function displayMessage(success, text) {
    messageDiv.className = success ? 'message success' : 'message error';
    messageDiv.textContent = text;
}

// Update the transaction history display
function updateTransactionHistory() {
    const history = dataProgram.getTransactionHistory();
    
    // Clear current list
    historyList.innerHTML = '';
    
    if (history.length === 0) {
        // Show empty state
        const emptyItem = document.createElement('li');
        emptyItem.className = 'history-item empty';
        emptyItem.textContent = 'No transactions yet';
        historyList.appendChild(emptyItem);
    } else {
        // Add transactions in reverse order (newest first)
        for (let i = history.length - 1; i >= 0; i--) {
            const transaction = history[i];
            const item = document.createElement('li');
            item.className = 'history-item';
            
            const date = new Date(transaction.timestamp);
            const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
              const typeClass = transaction.type.toLowerCase();
            const typeDisplay = transaction.type === 'CREDIT' ? 'Credit' : 'Debit';
            
            item.innerHTML = `
                <span class="transaction-date">${formattedDate}</span>
                <span class="transaction-type ${typeClass}">${typeDisplay}</span>
                <span class="transaction-amount">$${transaction.amount.toFixed(2)}</span>
            `;
            
            historyList.appendChild(item);
        }
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
