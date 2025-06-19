import React, { useState } from 'react';

function AuthPage({ onLoginSuccess }) {
  const [showLogin, setShowLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple validation (replace with real auth logic)
    if (username === 'admin' && password === 'password') {
      setError('');
      if (onLoginSuccess) onLoginSuccess();
    } else {
      setError('Invalid username or password');
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    // Simple validation (replace with real signup logic)
    if (username.length < 3 || password.length < 3) {
      setError('Username and password must be at least 3 characters long');
      return;
    }
    setError('');
    setSignupSuccess(true);
    setShowLogin(true);
    setUsername('');
    setPassword('');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f5f6fa' }}>
      <div style={{ background: '#fff', padding: 32, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', minWidth: 320 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <button onClick={() => { setShowLogin(true); setError(''); }} style={{ marginRight: 8, background: showLogin ? '#007bff' : '#ccc', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px' }}>Login</button>
          <button onClick={() => { setShowLogin(false); setError(''); setSignupSuccess(false); }} style={{ background: !showLogin ? '#28a745' : '#ccc', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px' }}>Sign Up</button>
        </div>
        {showLogin ? (
          <form onSubmit={handleLogin}>
            <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Login</h2>
            <div style={{ marginBottom: 16 }}>
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                style={{ width: '100%', padding: 8, marginTop: 4 }}
                required
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ width: '100%', padding: 8, marginTop: 4 }}
                required
              />
            </div>
            {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
            {signupSuccess && <div style={{ color: 'green', marginBottom: 16 }}>Signup successful! Please log in.</div>}
            <button type="submit" style={{ width: '100%', padding: 10, background: '#007bff', color: '#fff', border: 'none', borderRadius: 4 }}>Login</button>
          </form>
        ) : (
          <form onSubmit={handleSignup}>
            <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Sign Up</h2>
            <div style={{ marginBottom: 16 }}>
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                style={{ width: '100%', padding: 8, marginTop: 4 }}
                required
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ width: '100%', padding: 8, marginTop: 4 }}
                required
              />
            </div>
            {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
            <button type="submit" style={{ width: '100%', padding: 10, background: '#28a745', color: '#fff', border: 'none', borderRadius: 4 }}>Sign Up</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default AuthPage;
