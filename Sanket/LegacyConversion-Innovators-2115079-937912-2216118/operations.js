/**
 * operations.js - Business logic for account operations
 * Corresponds to Operations (operations.cob) in the original COBOL application
 */

class Operations {
    constructor(dataProgram) {
        this.dataProgram = dataProgram;
    }
    
    /**
     * Get the current account balance
     * Corresponds to the 'TOTAL' operation in COBOL Operations
     * @returns {number} Current account balance
     */
    getBalance() {
        return this.dataProgram.readBalance();
    }
    
    /**
     * Credit (deposit) funds to account
     * Corresponds to the 'CREDIT' operation in COBOL Operations
     * @param {number} amount - Amount to credit
     * @returns {Object} Result object with success status and new balance
     */
    creditAccount(amount) {
        // Validate amount
        if (isNaN(amount) || amount <= 0) {
            return {
                success: false,
                message: "Please enter a valid positive amount",
                balance: this.getBalance()
            };
        }
        
        // Perform credit operation
        const currentBalance = this.getBalance();
        const newBalance = currentBalance + amount;
        
        // Update balance in storage
        this.dataProgram.writeBalance(newBalance);
          // Add to transaction history
        this.dataProgram.addTransaction('CREDIT', amount, newBalance);
        
        return {
            success: true,
            message: `Amount credited successfully.`,
            balance: newBalance
        };
    }
    
    /**
     * Debit (withdraw) funds from account
     * Corresponds to the 'DEBIT' operation in COBOL Operations
     * @param {number} amount - Amount to debit
     * @returns {Object} Result object with success status and new balance
     */
    debitAccount(amount) {
        // Validate amount
        if (isNaN(amount) || amount <= 0) {
            return {
                success: false,
                message: "Please enter a valid positive amount",
                balance: this.getBalance()
            };
        }
        
        // Get current balance
        const currentBalance = this.getBalance();
        
        // Check for sufficient funds
        if (currentBalance < amount) {
            return {
                success: false,
                message: "Insufficient funds for this debit",
                balance: currentBalance
            };
        }
        
        // Perform debit operation
        const newBalance = currentBalance - amount;
        
        // Update balance in storage
        this.dataProgram.writeBalance(newBalance);
          // Add to transaction history
        this.dataProgram.addTransaction('DEBIT', amount, newBalance);
        
        return {
            success: true,
            message: `Amount debited successfully.`,
            balance: newBalance
        };
    }
}

// Create global instance with dependency injection
const operations = new Operations(dataProgram);
