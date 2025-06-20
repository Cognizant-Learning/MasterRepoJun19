// Dashboard charts and visualizations

class DashboardCharts {
    constructor() {
        this.charts = {};
        this.initializeDashboard();
    }
    
    async initializeDashboard() {
        // Wait for data to be loaded
        setTimeout(() => {
            // Get the API instance
            const api = window.inventoryApi;
            if (!api) {
                console.error('Inventory API not initialized');
                return;
            }
            
            // Load data and initialize charts
            this.loadChartData();
        }, 500);
    }
    
    async loadChartData() {
        try {
            // Get inventory data
            const response = await inventoryApi.getAllItems();
            
            if (response.success && response.data) {
                const items = response.data;
                
                // Initialize charts with data
                this.initializeCategoryChart(items);
                this.initializeStockChart(items);
            }
        } catch (error) {
            console.error('Error loading chart data:', error);
        }
    }
      initializeCategoryChart(items) {
        // Group items by category
        const categories = {};
        items.forEach(item => {
            if (!categories[item.category]) {
                categories[item.category] = 0;
            }
            categories[item.category] += 1;
        });
        
        // Prepare data for chart
        const categoryLabels = Object.keys(categories);
        const categoryData = Object.values(categories);
        
        // Generate random colors for each category
        const categoryColors = categoryLabels.map(() => this.getRandomColor());
        
        // Create the chart
        const ctx = document.getElementById('categoryChart').getContext('2d');
        if (this.charts.categoryChart) {
            this.charts.categoryChart.destroy();
        }
        
        // Create accessible chart summary
        this.createAccessibleChartSummary('categoryChartSummary', 'Category Distribution', categoryLabels, categoryData);
        
        this.charts.categoryChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: categoryLabels,
                datasets: [{
                    data: categoryData,
                    backgroundColor: categoryColors,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            // Increase text size and padding for better touch targets
                            font: {
                                size: 14
                            },
                            padding: 16
                        }
                    },
                    title: {
                        display: true,
                        text: 'Items by Category',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${value} items (${percentage}%)`;
                            }
                        }
                    }
                },
                // This enables better accessibility
                plugins: [{
                    id: 'chartAccessibility',
                    afterDraw: (chart) => {
                        const ctx = chart.ctx;
                        ctx.save();
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillStyle = '#666';
                        ctx.fillText('Chart: Items by Category', chart.width / 2, 10);
                        ctx.restore();
                    }
                }]
            }
        });
    }
      initializeStockChart(items) {
        // Count items by stock status
        const lowStockThreshold = CONFIG.LOW_STOCK_THRESHOLD || 10;
        const stockStatus = {
            healthy: 0,
            low: 0,
            outOfStock: 0
        };
        
        items.forEach(item => {
            if (item.quantity === 0) {
                stockStatus.outOfStock += 1;
            } else if (item.quantity < lowStockThreshold) {
                stockStatus.low += 1;
            } else {
                stockStatus.healthy += 1;
            }
        });
        
        // Prepare data for chart
        const labels = ['Healthy Stock', 'Low Stock', 'Out of Stock'];
        const data = [stockStatus.healthy, stockStatus.low, stockStatus.outOfStock];
        const backgroundColors = [
            'rgba(40, 167, 69, 0.7)', // Green for healthy
            'rgba(255, 193, 7, 0.7)', // Yellow for low
            'rgba(220, 53, 69, 0.7)'  // Red for out of stock
        ];
        
        // Create the chart
        const ctx = document.getElementById('stockChart').getContext('2d');
        if (this.charts.stockChart) {
            this.charts.stockChart.destroy();
        }
        
        // Create accessible chart summary
        this.createAccessibleChartSummary('stockChartSummary', 'Stock Status', labels, data);
        
        this.charts.stockChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: backgroundColors,
                    hoverOffset: 4,
                    // High contrast border for better visibility
                    borderColor: ['#1a5928', '#8c6900', '#7d1a24'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            // Increase text size and padding for better touch targets
                            font: {
                                size: 14
                            },
                            padding: 16,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Stock Status',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${value} items (${percentage}%)`;
                            }
                        }
                    }
                },
                // Make the center accessible
                plugins: [{
                    id: 'stockChartAccessibility',
                    afterDraw: (chart) => {
                        const ctx = chart.ctx;
                        ctx.save();
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.font = '14px Arial';
                        ctx.fillStyle = '#666';
                        
                        const total = data.reduce((sum, val) => sum + val, 0);
                        
                        ctx.fillText(`${total} total items`, chart.width / 2, chart.height / 2);
                        ctx.restore();
                    }
                }]
            }
        });
    }
    
    // Refresh charts when data changes
    refreshCharts() {
        this.loadChartData();
    }
      // Generate a random color
    getRandomColor() {
        const r = Math.floor(Math.random() * 200) + 55;
        const g = Math.floor(Math.random() * 200) + 55;
        const b = Math.floor(Math.random() * 200) + 55;
        return `rgba(${r}, ${g}, ${b}, 0.7)`;
    }
    
    // Create an accessible text alternative for charts
    createAccessibleChartSummary(elementId, title, labels, data) {
        // Find or create the hidden div for screen readers
        let summaryElement = document.getElementById(elementId);
        if (!summaryElement) {
            summaryElement = document.createElement('div');
            summaryElement.id = elementId;
            summaryElement.className = 'sr-only';
            summaryElement.setAttribute('aria-live', 'polite');
            summaryElement.setAttribute('role', 'region');
            summaryElement.setAttribute('aria-label', `${title} chart data`);
            
            // Find the chart's parent and insert the summary after it
            const chartCanvas = document.getElementById(elementId.replace('Summary', ''));
            if (chartCanvas && chartCanvas.parentNode) {
                chartCanvas.parentNode.appendChild(summaryElement);
            } else {
                document.body.appendChild(summaryElement);
            }
        }
        
        // Calculate total for percentages
        const total = data.reduce((sum, val) => sum + val, 0);
        
        // Generate the accessible text description
        let description = `<h2 class="sr-only">${title} - Visual Chart</h2>`;
        description += `<p>This chart displays ${title} with ${labels.length} categories:</p>`;
        description += '<ul>';
        
        for (let i = 0; i < labels.length; i++) {
            const percentage = Math.round((data[i] / total) * 100);
            description += `<li>${labels[i]}: ${data[i]} items (${percentage}%)</li>`;
        }
        
        description += '</ul>';
        description += `<p>Total: ${total} items</p>`;
        
        // Update the element content
        summaryElement.innerHTML = description;
        
        // Announce to screen readers if helper is available
        if (window.accessibilityHelper) {
            accessibilityHelper.announce(`${title} chart updated with ${labels.length} categories`);
        }
    }
}

// Initialize dashboard charts
let dashboardCharts;
document.addEventListener('DOMContentLoaded', () => {
    // Wait for app.js to initialize the API
    setTimeout(() => {
        dashboardCharts = new DashboardCharts();
    }, 1000);
});
