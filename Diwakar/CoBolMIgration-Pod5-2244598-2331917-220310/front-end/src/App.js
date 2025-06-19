import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Navbar, Button, Alert } from 'react-bootstrap';
import AccountBalance from './components/AccountBalance';
import AccountOperations from './components/AccountOperations';
import AccountService from './services/AccountService';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState('');
  const [initialized, setInitialized] = useState(false);

  const fetchAccountBalance = async () => {
    try {
      const response = await AccountService.getBalance();
      setBalance(parseFloat(response.data.balance));
      setError('');
    } catch (error) {
      if (error.response?.status === 404) {
        setError('Account not found. Please initialize your account.');
        setInitialized(false);
      } else {
        setError('Error retrieving balance. Please try again later.');
      }
    }
  };

  const initializeAccount = async () => {
    try {
      await AccountService.initializeAccount();
      setInitialized(true);
      fetchAccountBalance();
    } catch (error) {
      setError('Failed to initialize account');
    }
  };

  useEffect(() => {
    fetchAccountBalance();
  }, []);

  return (
    <div className="App">
      <Navbar bg="dark" variant="dark" className="mb-4">
        <Container>
          <Navbar.Brand>Banking Management System</Navbar.Brand>
        </Container>
      </Navbar>
      
      <Container>
        <Row className="justify-content-md-center">
          <Col md={6}>
            {error && (
              <Alert variant="danger" className="mt-3">
                {error}
                {!initialized && (
                  <div className="mt-3">
                    <Button onClick={initializeAccount} variant="primary">
                      Initialize Account
                    </Button>
                  </div>
                )}
              </Alert>
            )}
            
            <AccountBalance balance={balance} />
            <AccountOperations refreshBalance={fetchAccountBalance} />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
