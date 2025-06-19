/**
 * data.js - Data persistence layer
 * Corresponds to DataProgram (data.cob) in the original COBOL application
 */

class DataProgram {
    constructor() {
        // Initialize storage if it doesn't exist
        if (localStorage.getItem('accountBalance') === null) {
            // Set initial balance to 1000.00 as in the original COBOL application
            localStorage.setItem('accountBalance', '1000.00');
        }
        
        // Initialize transaction history if it doesn't exist
        if (localStorage.getItem('transactionHistory') === null) {
            localStorage.setItem('transactionHistory', JSON.stringify([]));
        }
    }
    
    /**
     * Read the account balance from storage
     * Corresponds to the 'READ' operation in COBOL DataProgram
     * @returns {number} The current account balance
     */
    readBalance() {
        return parseFloat(localStorage.getItem('accountBalance'));
    }
    
    /**
     * Write the account balance to storage
     * Corresponds to the 'WRITE' operation in COBOL DataProgram
     * @param {number} balance - The balance to store
     */
    writeBalance(balance) {
        localStorage.setItem('accountBalance', balance.toFixed(2));
    }
    
    /**
     * Add a transaction to history (enhancement beyond original COBOL)
     * @param {string} type - Transaction type ('CREDIT' or 'DEBIT')
     * @param {number} amount - Transaction amount
     * @param {number} newBalance - Balance after transaction
     */
    addTransaction(type, amount, newBalance) {
        const history = JSON.parse(localStorage.getItem('transactionHistory'));
        
        history.push({
            type: type,
            amount: amount,
            balance: newBalance,
            timestamp: new Date().toISOString()
        });
        
        // Keep only the last 10 transactions (optional enhancement)
        if (history.length > 10) {
            history.shift();
        }
        
        localStorage.setItem('transactionHistory', JSON.stringify(history));
    }
    
    /**
     * Clear all transaction history
     */
    clearTransactionHistory() {
        localStorage.setItem('transactionHistory', JSON.stringify([]));
    }
    
    /**
     * Get transaction history
     * @returns {Array} Transaction history array
     */
    getTransactionHistory() {
        return JSON.parse(localStorage.getItem('transactionHistory'));
    }
}

// Create global instance
const dataProgram = new DataProgram();
