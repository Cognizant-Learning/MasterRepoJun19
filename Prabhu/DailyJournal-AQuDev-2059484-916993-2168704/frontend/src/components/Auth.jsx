import React, { useState } from 'react';

const Auth = ({ onAuth }) => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (email && password) {
        onAuth({ email });
        setError('');
      } else {
        setError('Please enter email and password');
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="auth-container minimal card">
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', fontWeight: 700, color: 'var(--accent)' }}>
        {isSignIn ? 'Welcome Back' : 'Create Account'}
      </h2>
      <form onSubmit={handleSubmit} style={{ gap: '1rem', display: 'flex', flexDirection: 'column' }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete={isSignIn ? "current-password" : "new-password"}
        />
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading} style={{ fontWeight: 600 }}>
          {loading ? '...' : isSignIn ? 'Sign In' : 'Sign Up'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-secondary)' }}>
        {isSignIn ? 'No account?' : 'Already have an account?'}{' '}
        <button className="link" onClick={() => setIsSignIn(!isSignIn)}>
          {isSignIn ? 'Sign Up' : 'Sign In'}
        </button>
      </p>
    </div>
  );
};

export default Auth;
