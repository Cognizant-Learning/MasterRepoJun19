import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import JournalDashboard from './components/JournalDashboard';
import NavBar from './components/NavBar';
import Profile from './components/Profile';
import Settings from './components/Settings';
import About from './components/About';
import Charts from './components/Charts';
import './App.css';

function getInitialTheme() {
  const cached = localStorage.getItem('theme');
  if (cached) return cached;
  return 'dark'; // Default to dark theme
}

function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <Router>
      <div className="app-root">
        {user && <NavBar />}
        <div className="centered-content">
          <Routes>
            {!user ? (
              <Route path="*" element={<Auth onAuth={setUser} />} />
            ) : (
              <>
                <Route path="/dashboard" element={<JournalDashboard />} />
                <Route path="/charts" element={<Charts />} />
                <Route path="/profile" element={<Profile user={user} />} />
                <Route path="/settings" element={<Settings theme={theme} setTheme={setTheme} />} />
                <Route path="/about" element={<About />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </>
            )}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
