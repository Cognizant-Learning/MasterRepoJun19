import React from 'react';
import { Card } from 'react-bootstrap';

function AccountBalance({ balance }) {
    return (
        <Card className="mt-4">
            <Card.Header as="h5">Account Balance</Card.Header>
            <Card.Body>
                <Card.Title className="text-center display-4">
                    ${balance !== null ? balance.toFixed(2) : '0.00'}
                </Card.Title>
            </Card.Body>
        </Card>
    );
}

export default AccountBalance;
