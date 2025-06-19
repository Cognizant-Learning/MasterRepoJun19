# Daily Journal and Mood Analyzer

A modern, minimalistic journaling and mood tracking application inspired by the Apple iOS Journal app. Track your mood, analyze your emotional trends, and keep a digital journal of your thoughts and experiences.

![Daily Journal App](https://via.placeholder.com/800x400?text=Daily+Journal+App)

## Features

- **Beautiful Minimalistic UI**: Clean, distraction-free interface with both light and dark mode support
- **iOS-inspired Design**: Glassmorphism effects, soft shadows, and smooth animations
- **Journal Entries**: Write and save your thoughts with timestamps
- **Mood Tracking**: Track your mood on a scale from 1-9 with emoji visualization
- **Emotion Tagging**: Select specific emotions to better describe how you're feeling
- **Category System**: Organize entries by Family, Personal, Office, or Other categories
- **Mood Analytics**: Visualize your mood trends over time with interactive graphs
- **Word Cloud**: See which words and emotions appear most frequently in your journal
- **Persistent Storage**: All entries are stored locally using IndexedDB
- **Responsive Design**: Works on both desktop and mobile devices

## Screenshots

<div style="display: flex; flex-wrap: wrap; gap: 10px;">
  <img src="https://via.placeholder.com/400x200?text=Journal+Entry" alt="Journal Entry" width="400px" />
  <img src="https://via.placeholder.com/400x200?text=Mood+Tracker" alt="Mood Tracker" width="400px" />
  <img src="https://via.placeholder.com/400x200?text=Journal+List" alt="Journal List" width="400px" />
  <img src="https://via.placeholder.com/400x200?text=Word+Cloud" alt="Word Cloud" width="400px" />
</div>

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/DailyJournal-CodeVibe.git
   cd DailyJournal-CodeVibe-2210179-2108491-332732
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**

   The application will be available at [http://localhost:3000](http://localhost:3000) (or the port shown in your terminal).

## Building for Production

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
├── public/              # Static assets 
├── src/                 # Source code
│   ├── services/        # Database services
│   │   ├── db.js        # IndexedDB implementation
│   │   └── seedData.js  # Sample data generator
│   ├── App.jsx          # Main application component
│   ├── JournalEntry.jsx # Journal entry form
│   ├── JournalList.jsx  # List of journal entries
│   ├── MoodTracker.jsx  # Mood analytics and visualization
│   ├── Navigation.jsx   # Navigation component
│   ├── main.jsx         # Application entry point
│   └── slider.css       # Styles for mood slider
├── index.html           # HTML entry point
├── package.json         # Dependencies and scripts
└── vite.config.js       # Vite configuration
```

## Technologies Used

- **React**: UI framework
- **Vite**: Build tool and development server
- **IndexedDB**: Browser-based storage
- **CSS-in-JS**: Styled components using inline styles

## Usage

1. **Create a new entry**: 
   - Click on "New Entry" or use the "+" floating action button
   - Write your journal entry
   - Select your mood using the slider
   - Choose a specific emotion chip
   - Select a category tag
   - Click "Add Entry"

2. **View your journal**:
   - Click on "My Journal" to see all your past entries
   - Entries are sorted with the most recent at the top
   - Use the delete button to remove entries

3. **Analyze your mood**:
   - Click on "Mood Tracker" to view analytics
   - See your average mood, most common mood, and mood range
   - View your mood journey over time
   - Explore the mood distribution chart
   - Check out the word cloud showing your most used words and emotions

## First-Time Setup

The first time you run the application, it will automatically seed the database with sample journal entries to demonstrate the analytics features. You can start adding your own entries right away.

## Browser Compatibility

This app works best in modern browsers that support IndexedDB:
- Chrome
- Firefox
- Safari
- Edge

## License

[MIT License](LICENSE)

## Acknowledgments

- Design inspired by Apple's iOS Journal app
- Icons and emojis from standard emoji set
