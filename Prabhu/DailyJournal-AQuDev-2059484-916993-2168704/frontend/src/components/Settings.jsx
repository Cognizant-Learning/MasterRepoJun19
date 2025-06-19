import React, { useState, useEffect } from 'react';

const Settings = ({ theme, setTheme }) => {
  const [selectedTheme, setSelectedTheme] = useState(theme);

  useEffect(() => {
    setSelectedTheme(theme);
  }, [theme]);

  const handleThemeChange = (e) => {
    setSelectedTheme(e.target.value);
    setTheme(e.target.value);
    localStorage.setItem('theme', e.target.value);
  };

  return (
    <div className="dashboard-container minimal centered-content">
      <div className="card" style={{maxWidth:600, width:'100%'}}>
        <h2 style={{textAlign:'center',fontWeight:700,color:'var(--accent)'}}>Settings</h2>
        <div style={{margin:'2rem 0',textAlign:'center'}}>
          <div style={{marginBottom:'2rem'}}>
            <label style={{fontWeight:500,marginRight:'1rem'}}>Theme:</label>
            <select 
              value={selectedTheme} 
              onChange={handleThemeChange}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                background: 'var(--secondary-dark)',
                color: 'var(--text-primary)',
                border: '1px solid var(--accent)'
              }}
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>
          <div style={{color:'var(--text-secondary)', marginTop:'3rem'}}>More settings coming soon...</div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
