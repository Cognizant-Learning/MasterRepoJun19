import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import AccountService from '../services/AccountService';

function AccountOperations({ refreshBalance }) {
    const [amount, setAmount] = useState('');
    const [operation, setOperation] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!amount || amount <= 0) {
            setError('Please enter a valid amount');
            return;
        }
        
        setError('');
        setMessage('');
        
        try {
            let response;
            
            if (operation === 'credit') {
                response = await AccountService.creditAccount(parseFloat(amount));
                setMessage(`Credit successful: ${response.data.message}`);
            } else if (operation === 'debit') {
                response = await AccountService.debitAccount(parseFloat(amount));
                setMessage(`Debit successful: ${response.data.message}`);
            }
            
            setAmount('');
            refreshBalance();
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data.error);
            } else {
                setError('An error occurred during the transaction');
            }
        }
    };

    return (
        <div className="mt-4">
            <h3>Account Transactions</h3>
            
            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Amount</Form.Label>
                    <Form.Control
                        type="number"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                    />
                </Form.Group>
                
                <div className="d-grid gap-2">
                    <Button 
                        variant="success" 
                        onClick={() => setOperation('credit')} 
                        type="submit"
                    >
                        Credit Account
                    </Button>
                    <Button 
                        variant="warning" 
                        onClick={() => setOperation('debit')} 
                        type="submit"
                    >
                        Debit Account
                    </Button>
                </div>
            </Form>
        </div>
    );
}

export default AccountOperations;
