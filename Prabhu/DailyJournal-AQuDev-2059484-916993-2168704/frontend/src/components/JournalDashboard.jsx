import React, { useState, useEffect } from 'react';
import MotivationPanel from './MotivationPanel';
import MoodIcon from './MoodIcon';
import DailyMoodChart from './DailyMoodChart';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const dummyJournals = [
  { id: 1, date: '2025-06-19', mood: 'happy', entry: 'Completed the dashboard UI redesign!' },
  { id: 2, date: '2025-06-18', mood: 'excited', entry: 'Started working on a new project, feeling motivated!' },
  { id: 3, date: '2025-06-17', mood: 'neutral', entry: 'Regular day at work, had a good lunch.' },
  { id: 4, date: '2025-06-16', mood: 'happy', entry: 'Met friends for dinner, great conversations!' },
  { id: 5, date: '2025-06-15', mood: 'sad', entry: 'Rainy day, stayed indoors mostly.' },
  { id: 6, date: '2025-06-14', mood: 'excited', entry: 'Weekend trip planned, can\'t wait!' },
  { id: 7, date: '2025-06-13', mood: 'happy', entry: 'Productive day, finished all tasks early.' },
];

const moods = [
  { value: 'happy', label: 'Happy' },
  { value: 'sad', label: 'Sad' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'angry', label: 'Angry' },
  { value: 'excited', label: 'Excited' },
];

const moodToValue = { angry: 0, sad: 1, neutral: 2, happy: 3, excited: 4 };
const moodColors = {
  'angry': '#ef4444',
  'sad': '#64748b',
  'neutral': '#94a3b8',
  'happy': '#10b981',
  'excited': '#4ade80'
};

const JournalDashboard = () => {
  const [journals, setJournals] = useState([]);
  const [entry, setEntry] = useState('');
  const [mood, setMood] = useState('happy');
  const [adding, setAdding] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    // Simulate API fetch with dummy data
    setTimeout(() => setJournals(dummyJournals), 500);
  }, []);

  const handleAddEntry = (e) => {
    e.preventDefault();
    if (!entry) return;
    setAdding(true);
    setTimeout(() => {
      const newJournal = {
        id: Date.now(),
        date: new Date().toISOString().slice(0, 10),
        mood,
        entry,
      };
      setJournals([newJournal, ...journals]);
      setEntry('');
      setMood('happy');
      setAdding(false);
    }, 500);
  };

  // Prepare weekly mood trend data
  const weeklyMoodData = {
    labels: journals.slice(0, 7).map(j => j.date).reverse(),
    datasets: [
      {
        label: 'Weekly Mood',
        data: journals.slice(0, 7).map(j => moodToValue[j.mood]).reverse(),
        fill: true,
        borderColor: '#10b981',
        backgroundColor: function(context) {
          const chart = context.chart;
          const {ctx, chartArea} = chart || {};
          if (!ctx || !chartArea) return 'rgba(16, 185, 129, 0.1)';
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, 'rgba(16, 185, 129, 0.05)');
          gradient.addColorStop(1, 'rgba(16, 185, 129, 0.25)');
          return gradient;
        },
        tension: 0.4,
        pointRadius: 8,
        pointHoverRadius: 10,
        pointBackgroundColor: function(context) {
          if (!context.raw && context.raw !== 0) return '#10b981';
          const mood = Object.keys(moodToValue).find(key => moodToValue[key] === context.raw);
          return moodColors[mood] || '#10b981';
        },
        pointBorderColor: '#f8fafc',
        pointBorderWidth: 2,
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true, 
        text: 'Weekly Mood Trend', 
        color: '#f8fafc',
        font: { size: 18, weight: 'bold' }
      },
      tooltip: {
        callbacks: {
          label: ctx => `Mood: ${Object.keys(moodToValue).find(key => moodToValue[key] === ctx.parsed.y)}`,
        },
        backgroundColor: '#0f172a',
        titleColor: '#f8fafc',
        bodyColor: '#f8fafc',
        borderColor: '#10b981',
        borderWidth: 1,
        padding: 10,
      }
    },
    scales: {
      y: {
        min: 0,
        max: 4,
        ticks: {
          stepSize: 1,
          callback: v => Object.keys(moodToValue).find(key => moodToValue[key] === v),
          color: '#cbd5e1',
          font: { weight: 'bold' }
        },
        grid: { color: 'rgba(203, 213, 225, 0.1)' },
      },
      x: {
        ticks: { 
          color: '#cbd5e1',
          font: { weight: 'bold' }
        },
        grid: { color: 'rgba(203, 213, 225, 0.1)' },
      },
    },
    layout: {
      padding: 20,
    },
  };

  return (
    <div className="dashboard-container minimal centered-content">
      <div className="card full-width">
        <MotivationPanel />
      </div>
      
      {/* Journal Entry Section */}
      <div className="card full-width">
        <h2 style={{textAlign:'center',fontWeight:700,marginBottom:'1.5rem',color:'var(--accent)'}}>Daily Journal</h2>
        <form className="journal-form" onSubmit={handleAddEntry} style={{gap:'1rem',display:'flex',flexDirection:'column',width:'100%',margin:'0 auto'}}>
          <textarea
            placeholder="How was your day?"
            value={entry}
            onChange={e => setEntry(e.target.value)}
          />
          <div className="mood-select">
            <label style={{fontWeight:500}}>Mood:</label>
            <select value={mood} onChange={e => setMood(e.target.value)}>
              {moods.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
            <MoodIcon mood={mood} />
          </div>
          <button type="submit" disabled={adding} style={{fontWeight:600}}>
            {adding ? 'Adding...' : 'Add Entry'}
          </button>
        </form>
      </div>
      
      {/* Weekly Mood Analysis Card */}
      <div className="card full-width">
        <h2 style={{textAlign:'center',fontWeight:700,marginBottom:'1.5rem',color:'var(--accent)'}}>Weekly Mood</h2>
        <div className="chart-container">
          <Line data={weeklyMoodData} options={chartOptions} />
        </div>
      </div>
      
      {/* Hourly Mood Chart (conditional) */}
      {selectedDate && (
        <div className="card full-width">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <h2 style={{fontWeight:700,color:'var(--accent)'}}>Daily Mood: {selectedDate}</h2>
            <button 
              onClick={() => setSelectedDate(null)}
              style={{background:'none',border:'none',color:'var(--text-secondary)',cursor:'pointer'}}
            >
              Close
            </button>
          </div>
          <div className="chart-container">
            <DailyMoodChart date={selectedDate} />
          </div>
        </div>
      )}
      
      {/* Previous Entries Card */}
      <div className="card full-width">
        <h3 style={{marginTop:'0',marginBottom:'1rem',fontWeight:600,textAlign:'center',color:'var(--accent)'}}>Previous Entries</h3>
        <ul className="journal-list card-list">
          {journals.map(j => (
            <li 
              key={j.id} 
              className="journal-item card journal-entry-card"
              onClick={() => setSelectedDate(j.date)}
              style={{cursor:'pointer'}}
            >
              <div className="journal-date">{j.date}</div>
              <MoodIcon mood={j.mood} />
              <div className="journal-entry">{j.entry}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default JournalDashboard;
