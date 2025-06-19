import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MoodAnalysis, MoodData } from '../../models/user.models';
import { JournalService } from '../../services/journal.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-mood-visualization',
  templateUrl: './mood-visualization.component.html',
  styleUrls: ['./mood-visualization.component.scss']
})
export class MoodVisualizationComponent implements OnInit, AfterViewInit {
  @Input() timeframe: 'week' | 'month' | 'year' = 'week';
  
  @ViewChild('moodTrendCanvas') moodTrendCanvas!: ElementRef;
  @ViewChild('activityCorrelationCanvas') activityCorrelationCanvas!: ElementRef;
  
  loading = false;
  error: string | null = null;
  
  moodAnalysis: MoodAnalysis | null = null;
  moodTrendChart: Chart | null = null;
  activityCorrelationChart: Chart | null = null;
  
  constructor(private journalService: JournalService) { }

  ngOnInit(): void {
    this.loadMoodAnalysis();
  }

  ngAfterViewInit(): void {
    if (this.moodAnalysis) {
      this.renderCharts();
    }
  }

  changeTimeframe(timeframe: 'week' | 'month' | 'year'): void {
    this.timeframe = timeframe;
    this.loadMoodAnalysis();
  }

  loadMoodAnalysis(): void {
    this.loading = true;
    this.error = null;
    
    this.journalService.getMoodAnalysis(this.timeframe).subscribe(
      (data) => {
        this.moodAnalysis = data;
        this.loading = false;
        
        // If charts are already initialized, destroy them first
        if (this.moodTrendChart) {
          this.moodTrendChart.destroy();
        }
        
        if (this.activityCorrelationChart) {
          this.activityCorrelationChart.destroy();
        }
        
        // Render charts after a short delay to ensure they're properly rendered
        setTimeout(() => {
          this.renderCharts();
        }, 100);
      },
      (error) => {
        this.error = 'Failed to load mood analysis. Please try again later.';
        this.loading = false;
        console.error('Error loading mood analysis:', error);
      }
    );
  }
  
  renderCharts(): void {
    if (!this.moodAnalysis) return;
    
    this.renderMoodTrendChart();
    this.renderActivityCorrelationChart();
  }
  
  renderMoodTrendChart(): void {
    if (!this.moodAnalysis || !this.moodTrendCanvas) return;
    
    const canvas = this.moodTrendCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    
    const labels = this.moodAnalysis.moodTrend.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    
    const data = this.moodAnalysis.moodTrend.map(item => item.value);
    
    this.moodTrendChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Mood Rating',
          data: data,
          backgroundColor: 'rgba(74, 111, 165, 0.2)',
          borderColor: 'rgba(74, 111, 165, 1)',
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 5,
            title: {
              display: true,
              text: 'Mood Rating'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Date'
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              title: function(tooltipItems) {
                return tooltipItems[0].label;
              },
              label: function(context) {
                let label = '';
                
                if (context.parsed.y !== null) {
                  let emoji = '😐';
                  const rating = context.parsed.y;
                  
                  if (rating >= 4.5) emoji = '🤩';
                  else if (rating >= 3.5) emoji = '😊';
                  else if (rating >= 2.5) emoji = '😐';
                  else if (rating >= 1.5) emoji = '😔';
                  else emoji = '😢';
                  
                  label = `Mood: ${rating.toFixed(1)} ${emoji}`;
                }
                
                return label;
              }
            }
          }
        }
      }
    });
  }
  
  renderActivityCorrelationChart(): void {
    if (!this.moodAnalysis || !this.activityCorrelationCanvas || this.moodAnalysis.commonActivities.length === 0) return;
    
    const canvas = this.activityCorrelationCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    
    // Use only top 5 activities for chart clarity
    const topActivities = this.moodAnalysis.commonActivities.slice(0, 5);
    
    const labels = topActivities.map(item => item.activity);
    const data = topActivities.map(item => item.correlation);
    
    // Generate color based on correlation
    const colors = topActivities.map(item => {
      const correlation = item.correlation;
      
      if (correlation >= 4) return 'rgba(46, 204, 113, 0.8)'; // Green for positive
      else if (correlation >= 3) return 'rgba(52, 152, 219, 0.8)'; // Blue for neutral-positive
      else if (correlation >= 2) return 'rgba(241, 196, 15, 0.8)'; // Yellow for neutral-negative
      else return 'rgba(231, 76, 60, 0.8)'; // Red for negative
    });
    
    this.activityCorrelationChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Mood Correlation',
          data: data,
          backgroundColor: colors,
          borderColor: colors.map(color => color.replace('0.8', '1')),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        scales: {
          x: {
            beginAtZero: true,
            max: 5,
            title: {
              display: true,
              text: 'Mood Rating'
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `Average mood: ${context.parsed.x.toFixed(1)}`;
              }
            }
          }
        }
      }
    });
  }
}
