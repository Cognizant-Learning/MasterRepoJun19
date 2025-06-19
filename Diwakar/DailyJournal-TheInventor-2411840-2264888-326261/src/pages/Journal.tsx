import React, { useState } from 'react';

interface Entry {
  id: number;
  date: string;
  text: string;
  mood: string; // Added mood property
  isEditing?: boolean;
}

const moodOptions = [
  { label: '😊 Happy', value: 'happy' },
  { label: '😢 Sad', value: 'sad' },
  { label: '😠 Angry', value: 'angry' },
  { label: '😐 Neutral', value: 'neutral' },
  { label: '😨 Anxious', value: 'anxious' },
  { label: '😍 Excited', value: 'excited' },
];

// Helper to calculate overall mood based on all moods in entries
const getOverallMoodByMajority = (entries: Entry[]) => {
  if (!entries.length) return 'neutral';
  const moodCount: Record<string, number> = {};
  entries.forEach(e => {
    if (e.mood) {
      moodCount[e.mood] = (moodCount[e.mood] || 0) + 1;
    }
  });
  // Find the mood(s) with the highest count
  let maxCount = 0;
  let maxMoods: string[] = [];
  Object.entries(moodCount).forEach(([mood, count]) => {
    if (count > maxCount) {
      maxCount = count;
      maxMoods = [mood];
    } else if (count === maxCount) {
      maxMoods.push(mood);
    }
  });
  // If tie, prefer happy > excited > neutral > anxious > sad > angry
  const moodPriority = ['happy', 'excited', 'neutral', 'anxious', 'sad', 'angry'];
  for (const mood of moodPriority) {
    if (maxMoods.includes(mood)) return mood
  }
  return maxMoods[0] || 'neutral';
};

const moodEmojis: Record<string, string> = {
  happy: '😊',
  sad: '😢',
  angry: '😠',
  neutral: '😐',
  anxious: '😨',
  excited: '😍',
};

// Journal entry management: Create, Edit, List, Calendar, Search
const Journal: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [text, setText] = useState('');
  const [mood, setMood] = useState('happy'); // Mood state for new entry
  const [editText, setEditText] = useState('');
  const [editMood, setEditMood] = useState('happy'); // Mood state for editing
  const [editId, setEditId] = useState<number | null>(null);

  const handleAdd = () => {
    if (text.trim()) {
      setEntries([
        { id: Date.now(), date: new Date().toLocaleDateString(), text, mood },
        ...entries,
      ]);
      setText('');
      setMood('happy');
    }
  };

  const handleDelete = (id: number) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  const handleEdit = (id: number, currentText: string, currentMood: string) => {
    setEditId(id);
    setEditText(currentText);
    setEditMood(currentMood);
  };

  const handleSaveEdit = (id: number) => {
    setEntries(entries.map(entry =>
      entry.id === id ? { ...entry, text: editText, mood: editMood } : entry
    ));
    setEditId(null);
    setEditText('');
    setEditMood('happy');
  };

  const overallMood = getOverallMoodByMajority(entries);

  return (
    <div style={{ width: '100vw', minHeight: '100vh', background: '#f5f5f5' }}>
      <div style={{ maxWidth: 480, margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #e0e0e0', padding: '16px 8px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 style={{ fontWeight: 700, color: '#1976d2', margin: '24px 0 18px 0', textAlign: 'center', letterSpacing: 1, width: '100%', maxWidth: 420 }}>Journal Entries</h2>
        <div style={{ width: '100%', maxWidth: 420, marginBottom: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Write your journal entry..."
            rows={3}
            style={{ width: '100%', borderRadius: 10, border: '1.5px solid #bdbdbd', padding: 12, fontSize: 16, background: '#f7faff', resize: 'none', boxSizing: 'border-box' }}
          />
          <label htmlFor="mood-select" style={{ fontWeight: 600, color: '#616161', marginTop: 2 }}>Mood:</label>
          <select
            id="mood-select"
            value={mood}
            onChange={e => setMood(e.target.value)}
            style={{ borderRadius: 10, border: '1.5px solid #bdbdbd', padding: 10, fontSize: 18, background: '#f7faff', color: '#424242', fontWeight: 600, appearance: 'none', textAlignLast: 'center' }}
          >
            {moodOptions.map(option => (
              <option key={option.value} value={option.value} style={{ fontSize: 22, padding: 8 }}>{option.label}</option>
            ))}
          </select>
          <button
            onClick={handleAdd}
            style={{
              marginTop: 8,
              background: '#1976d2',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              padding: '12px 0',
              fontWeight: 700,
              fontSize: 18,
              cursor: 'pointer',
              boxShadow: '0 2px 6px #e3e3e3',
              transition: 'background 0.2s',
              letterSpacing: 1,
              width: '100%'
            }}
          >
            Add Entry
          </button>
        </div>
        {/* Insights Section */}
        <div style={{ marginBottom: 24, fontSize: 22, display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', width: '100%', maxWidth: 420 }}>
          <span style={{ fontWeight: 600, color: '#616161' }}>Overall Mood:</span>
          <span style={{ fontSize: 36, filter: 'drop-shadow(0 2px 2px #e0e0e0)' }}>{moodEmojis[overallMood] || '😐'}</span>
          <span style={{ color: '#1976d2', fontWeight: 700, fontSize: 18 }}>({overallMood})</span>
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, width: '100%', maxWidth: 420, flex: 1, overflowY: 'auto' }}>
          {entries.map((entry) => (
            <li key={entry.id} style={{ marginBottom: 16, background: '#f5f5f5', borderRadius: 10, padding: 14, boxShadow: '0 1px 3px #ececec', minHeight: 80, display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <strong style={{ color: '#1976d2', fontSize: 15 }}>{entry.date}:</strong>
                {editId === entry.id ? null : (
                  <span style={{ fontSize: 28, filter: 'drop-shadow(0 1px 1px #e0e0e0)' }}>{moodEmojis[entry.mood] || entry.mood}</span>
                )}
              </div>
              {editId === entry.id ? (
                <>
                  <textarea
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    rows={3}
                    style={{ width: '100%', borderRadius: 10, border: '1.5px solid #bdbdbd', padding: 10, fontSize: 16, background: '#fff', marginTop: 8, resize: 'none' }}
                  />
                  <label htmlFor={`edit-mood-${entry.id}`} style={{ fontWeight: 600, color: '#616161', marginTop: 8, display: 'block' }}>Mood:</label>
                  <select
                    id={`edit-mood-${entry.id}`}
                    value={editMood}
                    onChange={e => setEditMood(e.target.value)}
                    style={{ borderRadius: 10, border: '1.5px solid #bdbdbd', padding: 10, fontSize: 18, background: '#f7faff', color: '#424242', fontWeight: 600, marginBottom: 8, appearance: 'none', textAlignLast: 'center' }}
                  >
                    {moodOptions.map(option => (
                      <option key={option.value} value={option.value} style={{ fontSize: 22, padding: 8 }}>{option.label}</option>
                    ))}
                  </select>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button onClick={() => handleSaveEdit(entry.id)} style={{ background: '#388e3c', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 16px', fontWeight: 600, cursor: 'pointer', fontSize: 16, width: 100 }}>Save</button>
                    <button onClick={() => setEditId(null)} style={{ background: '#e53935', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 16px', fontWeight: 600, cursor: 'pointer', fontSize: 16, width: 100 }}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ margin: '8px 0', color: '#424242', fontSize: 16, wordBreak: 'break-word' }}>{entry.text}</div>
                  <div style={{ color: '#757575', fontSize: 15, marginBottom: 6 }}>Mood: <span style={{ fontSize: 22 }}>{moodOptions.find(opt => opt.value === entry.mood)?.label || entry.mood}</span></div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => handleEdit(entry.id, entry.text, entry.mood)} style={{ background: '#fff', color: '#1976d2', border: '1.5px solid #1976d2', borderRadius: 8, padding: '6px 16px', fontWeight: 600, cursor: 'pointer', fontSize: 15, width: 100 }}>Edit</button>
                    <button onClick={() => handleDelete(entry.id)} style={{ background: '#fff', color: '#e53935', border: '1.5px solid #e53935', borderRadius: 8, padding: '6px 16px', fontWeight: 600, cursor: 'pointer', fontSize: 15, width: 100 }}>Delete</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Journal;
