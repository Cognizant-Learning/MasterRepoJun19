import React from 'react';

const About = () => (
  <div className="dashboard-container minimal centered-content">
    <div className="card" style={{maxWidth:600, width:'100%'}}>
      <h2 style={{textAlign:'center',fontWeight:700,color:'var(--accent)'}}>About This App</h2>
      <div style={{margin:'2rem 0',textAlign:'center'}}>
        <p>This is a minimalistic, privacy-focused Daily Journal & Mood Analyzer app built with React and Vite.</p>
        <p>Track your mood, write daily entries, and visualize your emotional journey.</p>
        <div style={{marginTop:'2rem',padding:'1rem',borderRadius:'8px',background:'var(--secondary-dark)'}}>
          <h3 style={{color:'var(--accent)',marginBottom:'1rem'}}>Features</h3>
          <ul style={{textAlign:'left',listStylePosition:'inside',padding:0}}>
            <li>Daily journal entries with mood tracking</li>
            <li>Weekly mood trend visualization</li>
            <li>Hourly mood breakdown</li>
            <li>Dark/light theme options</li>
            <li>Responsive design for all devices</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export default About;
