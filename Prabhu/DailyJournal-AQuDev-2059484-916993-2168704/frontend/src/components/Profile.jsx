import React from 'react';

const Profile = ({ user }) => {
  return (
    <div className="dashboard-container minimal centered-content">
      <div className="card" style={{maxWidth:600, width:'100%'}}>
        <h2 style={{textAlign:'center',fontWeight:700,color:'var(--accent)'}}>User Profile</h2>
        <div style={{margin:'2rem 0',textAlign:'center'}}>
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto',
            borderRadius: '50%',
            background: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem',
            fontSize: '2rem',
            color: 'var(--secondary-dark)',
            fontWeight: 'bold'
          }}>
            {user?.email?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div style={{fontSize:'1.2rem',fontWeight:500}}>{user?.email || 'Anonymous'}</div>
          <div style={{marginTop:'2rem',color:'var(--text-secondary)'}}>Member since June 2025</div>
          <div style={{color:'var(--text-secondary)'}}>Total Journal Entries: 15</div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
