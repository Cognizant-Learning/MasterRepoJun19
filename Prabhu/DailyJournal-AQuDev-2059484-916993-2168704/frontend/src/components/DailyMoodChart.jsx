import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement,
  BarElement,
  Title, 
  Tooltip, 
  Legend, 
  Filler
);

const valueToMood = ['angry', 'sad', 'neutral', 'happy', 'excited'];
const moodColors = {
  'angry': '#ef4444',
  'sad': '#64748b',
  'neutral': '#94a3b8',
  'happy': '#10b981',
  'excited': '#4ade80'
};

// Generate mock hourly data
const generateHourlyData = () => {
  const hours = [];
  const data = [];
  const colors = [];
  
  for (let i = 0; i < 24; i++) {
    hours.push(`${i}:00`);
    // Generate random mood value (0-4)
    const moodValue = Math.floor(Math.random() * 5);
    data.push(moodValue);
    colors.push(moodColors[valueToMood[moodValue]]);
  }
  
  return { hours, data, colors };
};

const DailyMoodChart = ({ date }) => {
  const { hours, data, colors } = generateHourlyData();
  
  const chartData = {
    labels: hours,
    datasets: [
      {
        label: 'Hourly Mood',
        data: data,
        backgroundColor: colors,
        borderWidth: 1,
        borderRadius: 4,
        maxBarThickness: 35,
      }
    ]
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: `Mood Throughout Day (${date})`,
        color: '#f8fafc',
        font: { size: 18, weight: 'bold' }
      },
      tooltip: {
        callbacks: {
          label: ctx => `Mood: ${valueToMood[ctx.parsed.y]}`,
        },
        backgroundColor: '#0f172a',
        titleColor: '#f8fafc',
        bodyColor: '#f8fafc',
        borderColor: '#10b981',
        borderWidth: 1,
        padding: 10,
      },
    },
    scales: {
      y: {
        min: 0,
        max: 4,
        ticks: {
          stepSize: 1,
          callback: v => valueToMood[v],
          color: '#cbd5e1',
          font: { weight: 'bold' }
        },
        grid: { color: 'rgba(203, 213, 225, 0.1)' },
      },
      x: {
        ticks: { 
          color: '#cbd5e1', 
          autoSkip: true,
          maxTicksLimit: 12,
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
    <div style={{height: '100%', width: '100%'}}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default DailyMoodChart;
