import React, { useState } from 'react';

// Simulate persistent balance storage (like data.cob)
let persistentBalance = 1000.00;

function readBalance() {
  // Simulate DataProgram 'READ'
  return persistentBalance;
}

function writeBalance(newBalance) {
  // Simulate DataProgram 'WRITE'
  persistentBalance = newBalance;
}

const MainPage = () => {
  const [choice, setChoice] = useState('');
  const [message, setMessage] = useState('');
  const [inputAmount, setInputAmount] = useState('');
  const [showAmountInput, setShowAmountInput] = useState(false);
  const [exited, setExited] = useState(false);
  const [balance, setBalance] = useState(readBalance());
  const [transactionHistory, setTransactionHistory] = useState([]);

  // Simulate Operations.cob logic
  const handleMenu = (e) => {
    e.preventDefault();
    switch (choice) {
      case '1': // View Balance
        setBalance(readBalance());
        setMessage(`Current balance: $${readBalance().toFixed(2)}`);
        setShowAmountInput(false);
        break;
      case '2': // Credit
        setShowAmountInput(true);
        setMessage('Enter credit amount:');
        break;
      case '3': // Debit
        setShowAmountInput(true);
        setMessage('Enter debit amount:');
        break;
      case '4': // Exit
        setExited(true);
        setMessage('Exiting the program. Goodbye!');
        setShowAmountInput(false);
        break;
      default:
        setMessage('Invalid choice, please select 1-4.');
        setShowAmountInput(false);
    }
  };

  const handleAmount = (e) => {
    e.preventDefault();
    const amt = parseFloat(inputAmount);
    if (isNaN(amt) || amt <= 0) {
      setMessage('Please enter a valid amount.');
      return;
    }
    let newHistory = [...transactionHistory];
    if (choice === '2') {
      // Credit
      const newBal = readBalance() + amt;
      writeBalance(newBal);
      setBalance(newBal);
      setMessage(`Amount credited. New balance: $${newBal.toFixed(2)}`);
      newHistory.push({ type: 'Credit', amount: amt, balance: newBal, date: new Date().toLocaleString() });
    } else if (choice === '3') {
      // Debit
      if (readBalance() >= amt) {
        const newBal = readBalance() - amt;
        writeBalance(newBal);
        setBalance(newBal);
        setMessage(`Amount debited. New balance: $${newBal.toFixed(2)}`);
        newHistory.push({ type: 'Debit', amount: amt, balance: newBal, date: new Date().toLocaleString() });
      } else {
        setMessage('Insufficient funds for this debit.');
      }
    }
    setTransactionHistory(newHistory);
    setShowAmountInput(false);
    setChoice('');
    setInputAmount('');
  };

  if (exited) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial, sans-serif', background: '#f7f9fa' }}>
        <div style={{ background: '#fff', padding: 32, borderRadius: 12, boxShadow: '0 2px 12px #e3e3e3', textAlign: 'center' }}>
          <h2>{message}</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f7f9fa', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ background: '#007bff', color: '#fff', padding: '32px 0 20px', textAlign: 'center', boxShadow: '0 2px 12px #e3e3e3' }}>
        <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 700 }}>Account Management System</h1>
        <p style={{ margin: 0, fontSize: '1.15rem', fontWeight: 400 }}>COBOL Migration Demo</p>
      </header>
      <main style={{ flex: 1, display: 'grid', placeItems: 'center', padding: '40px 0' }}>
        <div style={{ width: '100%', maxWidth: 480, minWidth: 280, background: '#fff', padding: 36, border: '1px solid #e3e3e3', borderRadius: 18, boxShadow: '0 4px 24px #e3e3e3', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h2 style={{ textAlign: 'center', color: '#007bff', marginBottom: 12, fontWeight: 700, fontSize: '1.5rem' }}>Account Management Menu</h2>
          <hr style={{ border: 'none', borderTop: '1.5px solid #e3e3e3', margin: '16px 0 24px' }} />
          <form onSubmit={handleMenu} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: '1.13rem', fontWeight: 500, color: '#333' }}>
              <div><span style={{ color: '#007bff', fontWeight: 700 }}>1.</span> View Balance</div>
              <div><span style={{ color: '#28a745', fontWeight: 700 }}>2.</span> Credit Account</div>
              <div><span style={{ color: '#dc3545', fontWeight: 700 }}>3.</span> Debit Account</div>
              <div><span style={{ color: '#6c757d', fontWeight: 700 }}>4.</span> Exit</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <label style={{ fontWeight: 500, flex: 1 }} htmlFor="choice-input">
                Enter your choice (1-4):
              </label>
              <input
                id="choice-input"
                type="number"
                min="1"
                max="4"
                value={choice}
                onChange={e => setChoice(e.target.value)}
                style={{ width: 60, padding: 6, borderRadius: 6, border: '1.5px solid #b3c6e0', fontSize: '1.1rem', transition: 'border 0.2s', outline: 'none' }}
                required
                disabled={showAmountInput}
              />
            </div>
            <button type="submit" style={{ width: '100%', padding: '10px 0', background: '#007bff', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: '1.1rem', boxShadow: '0 2px 8px #e3e3e3', transition: 'background 0.2s' }} disabled={showAmountInput}>Submit</button>
          </form>
          {showAmountInput && (
            <form onSubmit={handleAmount} style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 10 }} autoComplete="off">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <label style={{ fontWeight: 500, flex: 1 }} htmlFor="amount-input">
                  Amount:
                </label>
                <input
                  id="amount-input"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={inputAmount}
                  onChange={e => setInputAmount(e.target.value)}
                  style={{ width: 120, padding: 6, borderRadius: 6, border: '1.5px solid #b3c6e0', fontSize: '1.1rem', transition: 'border 0.2s', outline: 'none' }}
                  required
                />
              </div>
              <button type="submit" style={{ width: '100%', padding: '10px 0', background: '#007bff', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: '1.1rem', boxShadow: '0 2px 8px #e3e3e3', transition: 'background 0.2s' }}>OK</button>
            </form>
          )}
          {message && <div style={{ marginTop: 8, color: '#007bff', fontWeight: 600, textAlign: 'center', fontSize: '1.13rem' }}>{message}</div>}
          {transactionHistory.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <h3 style={{ color: '#333', fontSize: '1.15rem', marginBottom: 8, textAlign: 'center' }}>Transaction History</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '1rem' }}>
                  <thead>
                    <tr style={{ background: '#f1f3f6' }}>
                      <th style={{ padding: 8, border: '1px solid #e3e3e3' }}>Date/Time</th>
                      <th style={{ padding: 8, border: '1px solid #e3e3e3' }}>Type</th>
                      <th style={{ padding: 8, border: '1px solid #e3e3e3' }}>Amount</th>
                      <th style={{ padding: 8, border: '1px solid #e3e3e3' }}>Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactionHistory.map((txn, idx) => (
                      <tr key={idx}>
                        <td style={{ padding: 8, border: '1px solid #e3e3e3' }}>{txn.date}</td>
                        <td style={{ padding: 8, border: '1px solid #e3e3e3', color: txn.type === 'Credit' ? '#28a745' : '#dc3545', fontWeight: 600 }}>{txn.type}</td>
                        <td style={{ padding: 8, border: '1px solid #e3e3e3' }}>${txn.amount.toFixed(2)}</td>
                        <td style={{ padding: 8, border: '1px solid #e3e3e3' }}>${txn.balance.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
      <footer style={{ background: '#222', color: '#fff', textAlign: 'center', padding: '18px 0', fontSize: '1.08rem', marginTop: 36, borderTopLeftRadius: 12, borderTopRightRadius: 12, boxShadow: '0 -2px 12px #e3e3e3' }}>
        &copy; {new Date().getFullYear()} COBOL Code Migration — Powered by React
      </footer>
    </div>
  );
};

export default MainPage;
