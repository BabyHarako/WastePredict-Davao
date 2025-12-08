class ChartManager {
    constructor() {
        this.charts = {
            prediction: null
        };
        this.currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        this.chartColors = this.getChartColors();
    }
    
    getChartColors() {
        const isDark = this.currentTheme === 'dark';
        
        return {
            textColor: isDark ? '#e0e0e0' : '#333333',
            gridColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
            tickColor: isDark ? '#b0b0b0' : '#666666',
            borderColor: isDark ? '#ffffff' : '#333333',
            backgroundColor: isDark ? '#2d2d2d' : '#ffffff',
            
            // Line colors inspired by the reference image
            actualColor: 'rgb(76, 175, 80)',      // Green for actual
            xgboostColor: 'rgb(33, 150, 243)',    // Blue for XGBoost
        };
    }
    
    updateTheme(theme) {
        this.currentTheme = theme;
        this.chartColors = this.getChartColors();
        
        // Update existing chart
        if (this.charts.prediction) {
            this.updateChartTheme(this.charts.prediction);
        }
    }
    
    updateChartTheme(chart) {
        const colors = this.chartColors;
        
        // Update chart options
        if (chart.options && chart.options.scales) {
            if (chart.options.scales.x) {
                chart.options.scales.x.grid.color = colors.gridColor;
                chart.options.scales.x.ticks.color = colors.tickColor;
                chart.options.scales.x.ticks.font = { 
                    family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    size: 12
                };
            }
            
            if (chart.options.scales.y) {
                chart.options.scales.y.grid.color = colors.gridColor;
                chart.options.scales.y.ticks.color = colors.tickColor;
                chart.options.scales.y.ticks.font = { 
                    family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    size: 12
                };
            }
        }
        
        // Update title color if exists
        if (chart.options.plugins && chart.options.plugins.title) {
            chart.options.plugins.title.color = colors.textColor;
        }
        
        // Update legend color if exists
        if (chart.options.plugins && chart.options.plugins.legend) {
            chart.options.plugins.legend.labels.color = colors.textColor;
        }
        
        chart.update();
    }
    
    initializePredictionChart(ctx) {
        const colors = this.chartColors;
        
        // Create initial chart with empty data
        this.charts.prediction = new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [
                    {
                        label: 'Actual Waste (tons)',
                        data: [],
                        borderColor: colors.actualColor,
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        borderWidth: 3,
                        tension: 0.3,
                        fill: false,
                        pointBackgroundColor: colors.actualColor,
                        pointBorderColor: colors.borderColor,
                        pointBorderWidth: 1,
                        pointRadius: 5,
                        pointHoverRadius: 7
                    },
                    {
                        label: 'XGBoost Predictions (tons)',
                        data: [],
                        borderColor: colors.xgboostColor,
                        backgroundColor: 'rgba(33, 150, 243, 0.1)',
                        borderWidth: 2,
                        tension: 0.3,
                        fill: false,
                        borderDash: [5, 5],
                        pointBackgroundColor: colors.xgboostColor,
                        pointBorderColor: colors.borderColor,
                        pointBorderWidth: 1,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: colors.textColor,
                            font: {
                                family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                                size: 12
                            }
                        }
                    },
                    title: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: colors.backgroundColor,
                        titleColor: colors.textColor,
                        bodyColor: colors.textColor,
                        borderColor: colors.borderColor,
                        borderWidth: 1,
                        cornerRadius: 4,
                        padding: 10,
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.parsed.y} tons`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: colors.gridColor,
                            drawBorder: true,
                            borderColor: colors.borderColor
                        },
                        ticks: {
                            color: colors.tickColor,
                            font: {
                                family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                                size: 11
                            }
                        },
                        title: {
                            display: true,
                            text: 'Month',
                            color: colors.textColor,
                            font: {
                                family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                                size: 14,
                                weight: 'bold'
                            }
                        }
                    },
                    y: {
                        grid: {
                            color: colors.gridColor,
                            drawBorder: true,
                            borderColor: colors.borderColor
                        },
                        ticks: {
                            color: colors.tickColor,
                            font: {
                                family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                                size: 11
                            }
                        },
                        title: {
                            display: true,
                            text: 'Waste (tons)',
                            color: colors.textColor,
                            font: {
                                family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                                size: 14,
                                weight: 'bold'
                            }
                        },
                        beginAtZero: false
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                elements: {
                    line: {
                        tension: 0.3
                    },
                    point: {
                        hoverRadius: 6,
                        hoverBorderWidth: 2
                    }
                }
            }
        });
    }
    
    updatePredictionChart(dataset, predictions) {
        if (!this.charts.prediction) return;
        
        // Take last 12 months for display
        const displayLimit = 12;
        const limitedDataset = dataset.slice(-displayLimit);
        
        const labels = limitedDataset.map(row => 
            `${this.getMonthName(row.month)}`
        );
        
        const actualData = limitedDataset.map(row => row.waste);
        const xgbData = predictions.xgBoost.slice(-displayLimit);
        
        this.charts.prediction.data.labels = labels;
        this.charts.prediction.data.datasets[0].data = actualData;
        this.charts.prediction.data.datasets[1].data = xgbData;
        
        this.charts.prediction.update();
    }
    
    getMonthName(monthNumber) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[monthNumber - 1] || monthNumber;
    }
}