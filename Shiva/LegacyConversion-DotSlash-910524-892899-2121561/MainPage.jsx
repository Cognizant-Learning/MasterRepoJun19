import React, { useState } from 'react';
import './custom-fonts.css';

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
  const [theme, setTheme] = useState('light');

  const themeStyles = theme === 'dark'
    ? {
        background: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
        color: '#f1f1f1',
        cardBg: '#23272b',
        border: '#333',
        headerBg: 'rgba(34,46,58,0.95)',
        accent: '#0d6efd',
        footerBg: 'rgba(34,46,58,0.95)',
        shadow: '0 4px 24px #1118',
        tableHead: '#23272b',
        menuText: '#e0e6ed',
        inputBg: '#23272b',
        inputBorder: '#444',
        inputText: '#f1f1f1',
        label: '#b3c6e0',
        message: '#0d6efd',
        credit: '#4be37a',
        debit: '#ff6b6b',
        exit: '#b0b0b0',
      }
    : {
        background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
        color: '#222',
        cardBg: '#fff',
        border: '#e3e3e3',
        headerBg: 'rgba(0,123,255,0.95)',
        accent: '#007bff',
        footerBg: 'rgba(0,123,255,0.95)',
        shadow: '0 4px 24px #e3e3e3',
        tableHead: '#f1f3f6',
        menuText: '#333',
        inputBg: '#fff',
        inputBorder: '#b3c6e0',
        inputText: '#222',
        label: '#333',
        message: '#007bff',
        credit: '#28a745',
        debit: '#dc3545',
        exit: '#6c757d',
      };
  const fontFamily = 'Poppins, Inter, Segoe UI, Arial, Helvetica, sans-serif';
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

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
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily, background: themeStyles.background }}>
        <div style={{ background: themeStyles.cardBg, color: themeStyles.color, padding: 32, borderRadius: 12, boxShadow: themeStyles.shadow, textAlign: 'center' }}>
          <h2>{message}</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: themeStyles.background, color: themeStyles.color, fontFamily, transition: 'background 0.4s, color 0.3s' }}>
      <header style={{ background: themeStyles.headerBg, color: '#fff', padding: '32px 0 20px', textAlign: 'center', boxShadow: themeStyles.shadow, fontFamily, borderBottom: '2px solid #007bff' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', maxWidth: 900, margin: '0 auto', position: 'relative' }}>
          <button
            onClick={toggleTheme}
            style={{ position: 'absolute', right: 0, top: 0, margin: 16, padding: '6px 18px', borderRadius: 20, border: 'none', background: themeStyles.cardBg, color: themeStyles.color, fontWeight: 600, fontSize: '1rem', boxShadow: themeStyles.shadow, cursor: 'pointer', transition: 'background 0.2s, color 0.2s', borderColor: themeStyles.border }}
            onMouseOver={e => e.currentTarget.style.background = theme === 'dark' ? '#2a2f36' : '#e3e3e3'}
            onMouseOut={e => e.currentTarget.style.background = themeStyles.cardBg}
          >
            {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
        <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 700, color: themeStyles.color, fontFamily }}>Account Management System</h1>
        <p style={{ margin: 0, fontSize: '1.15rem', fontWeight: 400, color: themeStyles.color, fontFamily }}>COBOL Migration Demo</p>
      </header>
      <main style={{ flex: 1, display: 'grid', placeItems: 'center', padding: '40px 0', fontFamily }}>
        <div style={{ width: '100%', maxWidth: 480, minWidth: 280, background: themeStyles.cardBg, padding: 36, border: '1px solid ' + themeStyles.border, borderRadius: 18, boxShadow: themeStyles.shadow, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h2 style={{ textAlign: 'center', color: themeStyles.accent, marginBottom: 12, fontWeight: 700, fontSize: '1.5rem', fontFamily }}>Account Management Menu</h2>
          <hr style={{ border: 'none', borderTop: '1.5px solid ' + themeStyles.border, margin: '16px 0 24px' }} />
          <form onSubmit={handleMenu} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: 12, fontFamily }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: '1.13rem', fontWeight: 500, color: themeStyles.menuText }}>
              <div><span style={{ color: themeStyles.accent, fontWeight: 700 }}>1.</span> View Balance</div>
              <div><span style={{ color: themeStyles.credit, fontWeight: 700 }}>2.</span> Credit Account</div>
              <div><span style={{ color: themeStyles.debit, fontWeight: 700 }}>3.</span> Debit Account</div>
              <div><span style={{ color: themeStyles.exit, fontWeight: 700 }}>4.</span> Exit</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <label style={{ fontWeight: 500, flex: 1, color: themeStyles.label }} htmlFor="choice-input">
                Enter your choice (1-4):
              </label>
              <input
                id="choice-input"
                type="number"
                min="1"
                max="4"
                value={choice}
                onChange={e => setChoice(e.target.value)}
                style={{ width: 60, padding: 6, borderRadius: 6, border: '1.5px solid ' + themeStyles.inputBorder, fontSize: '1.1rem', transition: 'border 0.2s', outline: 'none', background: themeStyles.inputBg, color: themeStyles.inputText, fontFamily }}
                required
                disabled={showAmountInput}
              />
            </div>
            <button
              type="submit"
              style={{ width: '100%', padding: '10px 0', background: themeStyles.accent, color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: '1.1rem', boxShadow: themeStyles.shadow, transition: 'background 0.2s', fontFamily, cursor: 'pointer' }}
              onMouseOver={e => e.currentTarget.style.background = theme === 'dark' ? '#0b5ed7' : '#0056b3'}
              onMouseOut={e => e.currentTarget.style.background = themeStyles.accent}
              disabled={showAmountInput}
            >Submit</button>
          </form>
          {showAmountInput && (
            <form onSubmit={handleAmount} style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 10, fontFamily }} autoComplete="off">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <label style={{ fontWeight: 500, flex: 1, color: themeStyles.label }} htmlFor="amount-input">
                  Amount:
                </label>
                <input
                  id="amount-input"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={inputAmount}
                  onChange={e => setInputAmount(e.target.value)}
                  style={{ width: 120, padding: 6, borderRadius: 6, border: '1.5px solid ' + themeStyles.inputBorder, fontSize: '1.1rem', transition: 'border 0.2s', outline: 'none', background: themeStyles.inputBg, color: themeStyles.inputText, fontFamily }}
                  required
                />
              </div>
              <button
                type="submit"
                style={{ width: '100%', padding: '10px 0', background: themeStyles.accent, color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: '1.1rem', boxShadow: themeStyles.shadow, transition: 'background 0.2s', fontFamily, cursor: 'pointer' }}
                onMouseOver={e => e.currentTarget.style.background = theme === 'dark' ? '#0b5ed7' : '#0056b3'}
                onMouseOut={e => e.currentTarget.style.background = themeStyles.accent}
              >OK</button>
            </form>
          )}
          {message && <div style={{ marginTop: 8, color: themeStyles.message, fontWeight: 600, textAlign: 'center', fontSize: '1.13rem', fontFamily }}>{message}</div>}
        </div>
        {/* Transaction History Section */}
        {transactionHistory.length > 0 && (
          <section style={{ width: '100%', maxWidth: 700, margin: '32px auto 0', background: themeStyles.cardBg, border: '1.5px solid ' + themeStyles.border, borderRadius: 18, boxShadow: themeStyles.shadow, padding: 28, fontFamily }}>
            <h3 style={{ color: themeStyles.accent, fontSize: '1.25rem', marginBottom: 16, textAlign: 'center', fontWeight: 700, letterSpacing: 0.5 }}>Transaction History</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '1rem', background: themeStyles.cardBg, color: themeStyles.color, fontFamily }}>
                <thead>
                  <tr style={{ background: themeStyles.tableHead }}>
                    <th style={{ padding: 10, border: '1px solid ' + themeStyles.border }}>Date/Time</th>
                    <th style={{ padding: 10, border: '1px solid ' + themeStyles.border }}>Type</th>
                    <th style={{ padding: 10, border: '1px solid ' + themeStyles.border }}>Amount</th>
                    <th style={{ padding: 10, border: '1px solid ' + themeStyles.border }}>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {transactionHistory.map((txn, idx) => (
                    <tr key={idx}>
                      <td style={{ padding: 10, border: '1px solid ' + themeStyles.border }}>{txn.date}</td>
                      <td style={{ padding: 10, border: '1px solid ' + themeStyles.border, color: txn.type === 'Credit' ? themeStyles.credit : themeStyles.debit, fontWeight: 600 }}>{txn.type}</td>
                      <td style={{ padding: 10, border: '1px solid ' + themeStyles.border }}>${txn.amount.toFixed(2)}</td>
                      <td style={{ padding: 10, border: '1px solid ' + themeStyles.border }}>${txn.balance.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
      <footer style={{ background: themeStyles.footerBg, color: '#fff', textAlign: 'center', padding: '18px 0', fontSize: '1.08rem', marginTop: 36, borderTopLeftRadius: 12, borderTopRightRadius: 12, boxShadow: '0 -2px 12px ' + themeStyles.shadow, fontFamily }}>
        &copy; {new Date().getFullYear()} COBOL Code Migration — Powered by React
      </footer>
    </div>
  );
};

export default MainPage;
