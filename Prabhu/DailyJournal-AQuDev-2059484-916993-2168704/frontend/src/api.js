// Dummy API functions for development/demo purposes
// These functions simulate API calls with static data and timeouts

export const dummyUser = {
  email: 'demo@example.com',
  name: 'Demo User',
  joinDate: '2025-06-01'
};

export const dummyJournals = [
  { id: 1, date: '2025-06-19', mood: 'happy', entry: 'Completed the dashboard UI redesign!' },
  { id: 2, date: '2025-06-18', mood: 'excited', entry: 'Started working on a new project, feeling motivated!' },
  { id: 3, date: '2025-06-17', mood: 'neutral', entry: 'Regular day at work, had a good lunch.' },
  { id: 4, date: '2025-06-16', mood: 'happy', entry: 'Met friends for dinner, great conversations!' },
  { id: 5, date: '2025-06-15', mood: 'sad', entry: 'Rainy day, stayed indoors mostly.' },
  { id: 6, date: '2025-06-14', mood: 'excited', entry: 'Weekend trip planned, can\'t wait!' },
  { id: 7, date: '2025-06-13', mood: 'happy', entry: 'Productive day, finished all tasks early.' },
];

// Mock functions that return promises to simulate API calls
export const signIn = async (email, password) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ user: dummyUser });
    }, 500);
  });
};

export const signUp = async (email, password) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ user: { ...dummyUser, email } });
    }, 500);
  });
};

export const fetchUser = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(dummyUser);
    }, 300);
  });
};

export const addJournal = async (entry, mood) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newJournal = {
        id: Date.now(),
        date: new Date().toISOString().slice(0, 10),
        mood,
        entry
      };
      resolve(newJournal);
    }, 500);
  });
};

export const fetchJournals = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(dummyJournals);
    }, 500);
  });
};
