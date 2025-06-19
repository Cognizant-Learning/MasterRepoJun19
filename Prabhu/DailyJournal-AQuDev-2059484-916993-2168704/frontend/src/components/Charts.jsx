import React from 'react';
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

// Dummy data for last 7 days
const getLast7Days = () => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(5, 10));
  }
  return days;
};

const valueToMood = ['angry', 'sad', 'neutral', 'happy', 'excited'];
const moodColors = {
  'angry': '#ef4444',
  'sad': '#64748b',
  'neutral': '#94a3b8',
  'happy': '#10b981',
  'excited': '#4ade80'
};

const dummyMoodData = [3, 2, 3, 4, 1, 3, 2]; // Example mood values for 7 days

const Charts = () => {
  // Chart data and options
  const chartData = {
    labels: getLast7Days(),
    datasets: [
      {
        label: 'Mood',
        data: dummyMoodData,
        fill: true,
        borderColor: '#10b981',
        backgroundColor: function(context) {
          const chart = context.chart;
          const {ctx, chartArea} = chart || {};
          if (!ctx || !chartArea) return 'rgba(16, 185, 129, 0.10)';
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, 'rgba(16, 185, 129, 0.05)');
          gradient.addColorStop(1, 'rgba(16, 185, 129, 0.25)');
          return gradient;
        },
        tension: 0.4,
        pointRadius: 8,
        pointHoverRadius: 11,
        pointBackgroundColor: function(context) {
          if (context.raw === undefined) return '#10b981';
          const mood = valueToMood[context.raw];
          return moodColors[mood] || '#10b981';
        },
        pointBorderColor: '#f8fafc',
        pointBorderWidth: 2,
        borderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { 
        display: true, 
        text: 'Mood Trend (Last 7 Days)', 
        font: { size: 20, weight: 'bold' },
        color: '#f8fafc' 
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
      <div className="card" style={{width:'100%', maxWidth:'800px', height:'500px'}}>
        <h2 style={{textAlign:'center', fontWeight:700, color:'var(--accent)', marginBottom:'1.5rem'}}>Mood Analytics</h2>
        <div style={{height:'calc(100% - 60px)'}}>
          <Line data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default Charts;
