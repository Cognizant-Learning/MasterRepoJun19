import React from 'react';

const moods = {
  happy: <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#10b981" strokeWidth="2" fill="#0f172a"/><path d="M8 15c1.333 1 2.667 1 4 0" stroke="#10b981" strokeWidth="2" strokeLinecap="round"/><circle cx="9" cy="10" r="1" fill="#10b981"/><circle cx="15" cy="10" r="1" fill="#10b981"/></svg>,
  sad: <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#64748b" strokeWidth="2" fill="#0f172a"/><path d="M8 16c1.333-1 2.667-1 4 0" stroke="#64748b" strokeWidth="2" strokeLinecap="round"/><circle cx="9" cy="10" r="1" fill="#64748b"/><circle cx="15" cy="10" r="1" fill="#64748b"/></svg>,
  neutral: <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#94a3b8" strokeWidth="2" fill="#0f172a"/><path d="M8 15h8" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"/><circle cx="9" cy="10" r="1" fill="#94a3b8"/><circle cx="15" cy="10" r="1" fill="#94a3b8"/></svg>,
  angry: <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2" fill="#0f172a"/><path d="M8 16c1.333-1 2.667-1 4 0" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/><path d="M9 8l1 2" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/><path d="M15 8l-1 2" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/></svg>,
  excited: <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#4ade80" strokeWidth="2" fill="#0f172a"/><path d="M8 14c1.333 2 2.667 2 4 0" stroke="#4ade80" strokeWidth="2" strokeLinecap="round"/><circle cx="9" cy="10" r="1" fill="#4ade80"/><circle cx="15" cy="10" r="1" fill="#4ade80"/></svg>,
};

const MoodIcon = ({ mood }) => (
  <span className="mood-icon" title={mood} style={{ verticalAlign: 'middle' }}>
    {moods[mood] || null}
  </span>
);

export default MoodIcon;
