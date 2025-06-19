export interface User {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    preferences: {
        darkMode: boolean;
        reminderEnabled: boolean;
        reminderTime: string;
    };
    createdAt: Date;
    lastLogin: Date;
}

export interface AuthResponse {
    user: User;
    token: string;
    expiresAt: Date;
}

export interface JournalEntry {
    id: string;
    userId: string;
    title: string;
    content: string;
    moodRating: number;
    moodEmoji: string;
    activities: string[];
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

export interface MoodData {
    date: Date;
    moodRating: number;
    moodEmoji: string;
    journalEntryId?: string; // Optional reference to the journal entry
}

export interface MoodAnalysis {
    averageMood: number;
    moodTrend: {
        date: Date;
        value: number;
    }[];
    commonActivities: {
        activity: string;
        correlation: number; // Correlation coefficient between activity and mood
    }[];
    insights: string[];
}
