class ChartManager {
    constructor() {
        this.charts = {
            correlation: null,
            performance: null,
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
            
            // Dataset colors
            datasetColors: [
                'rgba(76, 175, 80, 0.8)',    // Green
                'rgba(33, 150, 243, 0.8)',   // Blue
                'rgba(255, 152, 0, 0.8)',    // Orange
                'rgba(156, 39, 176, 0.8)',   // Purple
                'rgba(244, 67, 54, 0.8)',    // Red
                'rgba(0, 150, 136, 0.8)'     // Teal
            ]
        };
    }
    
    updateTheme(theme) {
        this.currentTheme = theme;
        this.chartColors = this.getChartColors();
        
        // Update all existing charts
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                this.updateChartTheme(chart);
            }
        });
    }
    
    updateChartTheme(chart) {
        const colors = this.chartColors;
        
        // Update chart options
        if (chart.options && chart.options.scales) {
            if (chart.options.scales.x) {
                chart.options.scales.x.grid.color = colors.gridColor;
                chart.options.scales.x.ticks.color = colors.tickColor;
                chart.options.scales.x.ticks.font = { family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" };
            }
            
            if (chart.options.scales.y) {
                chart.options.scales.y.grid.color = colors.gridColor;
                chart.options.scales.y.ticks.color = colors.tickColor;
                chart.options.scales.y.ticks.font = { family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" };
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
        
        // Update tooltip if exists
        if (chart.options.plugins && chart.options.plugins.tooltip) {
            chart.options.plugins.tooltip.backgroundColor = colors.backgroundColor;
            chart.options.plugins.tooltip.titleColor = colors.textColor;
            chart.options.plugins.tooltip.bodyColor = colors.textColor;
            chart.options.plugins.tooltip.borderColor = colors.borderColor;
        }
        
        chart.update();
    }
    
    initializeCorrelationChart(ctx) {
        const colors = this.chartColors;
        
        this.charts.correlation = new Chart(ctx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Population', 'Income', 'Rainfall', 'Temperature', 'Trucks', 'Recycling'],
                datasets: [{
                    label: 'Correlation with Waste',
                    data: [0.85, 0.72, -0.65, 0.58, 0.42, -0.35],
                    backgroundColor: this.chartColors.datasetColors,
                    borderColor: colors.borderColor,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        labels: {
                            color: colors.textColor,
                            font: {
                                family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                                size: 12
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Feature Correlation with Waste Generation',
                        color: colors.textColor,
                        font: {
                            family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    tooltip: {
                        backgroundColor: colors.backgroundColor,
                        titleColor: colors.textColor,
                        bodyColor: colors.textColor,
                        borderColor: colors.borderColor,
                        borderWidth: 1,
                        cornerRadius: 4,
                        padding: 10
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
                                family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        max: 1.0,
                        min: -1.0,
                        grid: {
                            color: colors.gridColor,
                            drawBorder: true,
                            borderColor: colors.borderColor
                        },
                        ticks: {
                            color: colors.tickColor,
                            font: {
                                family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                            }
                        },
                        title: {
                            display: true,
                            text: 'Correlation Coefficient',
                            color: colors.textColor,
                            font: {
                                family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                                size: 14,
                                weight: 'bold'
                            }
                        }
                    }
                }
            }
        });
    }
    
    initializePerformanceChart(ctx) {
        const colors = this.chartColors;
        
        this.charts.performance = new Chart(ctx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Random Forest', 'Linear Regression', 'XGBoost'],
                datasets: [
                    {
                        label: 'RMSE (tons)',
                        data: [0, 0, 0],
                        backgroundColor: 'rgba(76, 175, 80, 0.8)',
                        borderColor: colors.borderColor,
                        borderWidth: 1
                    },
                    {
                        label: 'MAE (tons)',
                        data: [0, 0, 0],
                        backgroundColor: 'rgba(33, 150, 243, 0.8)',
                        borderColor: colors.borderColor,
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        labels: {
                            color: colors.textColor,
                            font: {
                                family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                                size: 12
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Model Performance Comparison',
                        color: colors.textColor,
                        font: {
                            family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    tooltip: {
                        backgroundColor: colors.backgroundColor,
                        titleColor: colors.textColor,
                        bodyColor: colors.textColor,
                        borderColor: colors.borderColor,
                        borderWidth: 1,
                        cornerRadius: 4,
                        padding: 10
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
                                family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: colors.gridColor,
                            drawBorder: true,
                            borderColor: colors.borderColor
                        },
                        ticks: {
                            color: colors.tickColor,
                            font: {
                                family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                            }
                        },
                        title: {
                            display: true,
                            text: 'Error (tons)',
                            color: colors.textColor,
                            font: {
                                family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                                size: 14,
                                weight: 'bold'
                            }
                        }
                    }
                }
            }
        });
    }
    
    initializePredictionChart(ctx) {
        const colors = this.chartColors;
        
        this.charts.prediction = new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Actual Waste',
                        data: [],
                        borderColor: 'rgb(76, 175, 80)',
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        borderWidth: 3,
                        tension: 0.3,
                        fill: false,
                        pointBackgroundColor: 'rgb(76, 175, 80)',
                        pointBorderColor: colors.borderColor,
                        pointBorderWidth: 1,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    },
                    {
                        label: 'Random Forest Predicted',
                        data: [],
                        borderColor: 'rgb(33, 150, 243)',
                        backgroundColor: 'rgba(33, 150, 243, 0.1)',
                        borderWidth: 2,
                        tension: 0.3,
                        fill: false,
                        borderDash: [5, 5],
                        pointBackgroundColor: 'rgb(33, 150, 243)',
                        pointBorderColor: colors.borderColor,
                        pointBorderWidth: 1,
                        pointRadius: 3,
                        pointHoverRadius: 5
                    },
                    {
                        label: 'Linear Regression Predicted',
                        data: [],
                        borderColor: 'rgb(255, 152, 0)',
                        backgroundColor: 'rgba(255, 152, 0, 0.1)',
                        borderWidth: 2,
                        tension: 0.3,
                        fill: false,
                        borderDash: [5, 5],
                        pointBackgroundColor: 'rgb(255, 152, 0)',
                        pointBorderColor: colors.borderColor,
                        pointBorderWidth: 1,
                        pointRadius: 3,
                        pointHoverRadius: 5
                    },
                    {
                        label: 'XGBoost Predicted',
                        data: [],
                        borderColor: 'rgb(156, 39, 176)',
                        backgroundColor: 'rgba(156, 39, 176, 0.1)',
                        borderWidth: 2,
                        tension: 0.3,
                        fill: false,
                        borderDash: [5, 5],
                        pointBackgroundColor: 'rgb(156, 39, 176)',
                        pointBorderColor: colors.borderColor,
                        pointBorderWidth: 1,
                        pointRadius: 3,
                        pointHoverRadius: 5
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        labels: {
                            color: colors.textColor,
                            font: {
                                family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                                size: 12
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Predicted vs Actual Waste Generation',
                        color: colors.textColor,
                        font: {
                            family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                            size: 16,
                            weight: 'bold'
                        }
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
                                family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                            },
                            maxRotation: 45,
                            minRotation: 45
                        },
                        title: {
                            display: true,
                            text: 'Month Index',
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
                                family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
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
    
    updatePerformanceChart(metrics) {
        if (this.charts.performance) {
            this.charts.performance.data.datasets[0].data = [
                metrics.randomForest?.rmse || 0,
                metrics.linearRegression?.rmse || 0,
                metrics.xgBoost?.rmse || 0
            ];
            
            this.charts.performance.data.datasets[1].data = [
                metrics.randomForest?.mae || 0,
                metrics.linearRegression?.mae || 0,
                metrics.xgBoost?.mae || 0
            ];
            
            this.charts.performance.update();
        }
    }
    
    updatePredictionChart(dataset, predictions) {
        if (!this.charts.prediction) return;
        
        const displayLimit = 24;
        const limitedDataset = dataset.slice(0, displayLimit);
        
        const labels = limitedDataset.map((row, index) => 
            `${this.getMonthName(row.month)} ${row.year}`
        );
        
        const actualData = limitedDataset.map(row => row.waste);
        const rfData = predictions.randomForest.slice(0, displayLimit);
        const lrData = predictions.linearRegression.slice(0, displayLimit);
        const xgbData = predictions.xgBoost.slice(0, displayLimit);
        
        this.charts.prediction.data.labels = labels;
        this.charts.prediction.data.datasets[0].data = actualData;
        this.charts.prediction.data.datasets[1].data = rfData;
        this.charts.prediction.data.datasets[2].data = lrData;
        this.charts.prediction.data.datasets[3].data = xgbData;
        
        this.charts.prediction.data.datasets[1].hidden = !predictions.randomForest.length;
        this.charts.prediction.data.datasets[2].hidden = !predictions.linearRegression.length;
        this.charts.prediction.data.datasets[3].hidden = !predictions.xgBoost.length;
        
        this.charts.prediction.update();
    }
    
    getMonthName(monthNumber) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[monthNumber - 1] || monthNumber;
    }
}