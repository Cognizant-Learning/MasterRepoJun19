import React, { useEffect, useState } from 'react';

interface Entry {
  id: number;
  date: string;
  text: string;
  mood: string;
}

const moodEmojis: Record<string, string> = {
  happy: '😊',
  sad: '😢',
  angry: '😠',
  neutral: '😐',
  anxious: '😨',
  excited: '😍',
};

function getMoodEmoji(mood: string) {
  return moodEmojis[mood] || '❓';
}

function getOverallMood(entries: Entry[]): string {
  if (!entries.length) return 'neutral';
  const moodCount: Record<string, number> = {};
  entries.forEach(e => {
    moodCount[e.mood] = (moodCount[e.mood] || 0) + 1;
  });
  return Object.entries(moodCount).sort((a, b) => b[1] - a[1])[0][0];
}

function groupBy(entries: Entry[], keyFn: (e: Entry) => string) {
  return entries.reduce((acc, entry) => {
    const key = keyFn(entry);
    if (!acc[key]) acc[key] = [];
    acc[key].push(entry);
    return acc;
  }, {} as Record<string, Entry[]>);
}

const Insights: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    // Load from localStorage (if used in Journal)
    const stored = localStorage.getItem('journalEntries');
    if (stored) setEntries(JSON.parse(stored));
  }, []);

  // Group by day (date string) and by month (YYYY-MM)
  const dayGroups = groupBy(entries, e => e.date);
  const monthGroups = groupBy(entries, e => e.date.slice(6) + '-' + e.date.slice(0, 2)); // MM/DD/YYYY to YYYY-MM

  const renderReport = (groups: Record<string, Entry[]>, label: string) => (
    <div style={{ marginBottom: 32 }}>
      <h3>{label} Report</h3>
      {Object.keys(groups).length === 0 && <p>No data available.</p>}
      <ul>
        {Object.entries(groups).map(([period, group]) => {
          const overallMood = getOverallMood(group);
          return (
            <li key={period} style={{ marginBottom: 12 }}>
              <strong>{period}:</strong> {getMoodEmoji(overallMood)} ({overallMood})<br />
              <span style={{ fontSize: 12, color: '#888' }}>Entries: {group.length}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );

  // Overall mood for all entries
  const overallMood = getOverallMood(entries);

  return (
    <div>
      <h2>Insights & Data Visualization</h2>
      <div style={{ fontSize: 24, marginBottom: 16 }}>
        Overall Mood: {getMoodEmoji(overallMood)} ({overallMood})
      </div>
      {renderReport(dayGroups, 'Day-wise')}
      {renderReport(monthGroups, 'Month-wise')}
    </div>
  );
};

export default Insights;
