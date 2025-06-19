import React from 'react';

const quotes = [
  "Every day is a fresh start.",
  "You are stronger than you think.",
  "Progress, not perfection.",
  "Small steps every day.",
  "Your feelings are valid.",
  "Keep going, you're doing great!",
  "Believe in yourself and all that you are."
];

const MotivationPanel = () => {
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  return (
    <div className="motivation-panel">
      <span role="img" aria-label="sparkles" style={{fontSize:'1.5rem',marginRight:'0.5rem'}}>✨</span>
      <span style={{fontStyle:'italic',fontWeight:500}}>{quote}</span>
    </div>
  );
};

export default MotivationPanel;
