class ChartManager {
    constructor() {
        this.charts = {
            correlation: null,
            performance: null,
            prediction: null
        };
    }
    
    initializeCorrelationChart(ctx) {
        this.charts.correlation = new Chart(ctx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Population', 'Income', 'Rainfall', 'Temperature', 'Trucks', 'Recycling'],
                datasets: [{
                    label: 'Correlation with Waste',
                    data: [0.85, 0.72, -0.65, 0.58, 0.42, -0.35],
                    backgroundColor: [
                        'rgba(76, 175, 80, 0.7)',
                        'rgba(33, 150, 243, 0.7)',
                        'rgba(255, 152, 0, 0.7)',
                        'rgba(156, 39, 176, 0.7)',
                        'rgba(244, 67, 54, 0.7)',
                        'rgba(0, 150, 136, 0.7)'
                    ]
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 1.0,
                        min: -1.0,
                        title: {
                            display: true,
                            text: 'Correlation Coefficient'
                        }
                    }
                }
            }
        });
    }
    
    initializePerformanceChart(ctx) {
        this.charts.performance = new Chart(ctx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Random Forest', 'Linear Regression', 'XGBoost'],
                datasets: [
                    {
                        label: 'RMSE (tons)',
                        data: [0, 0, 0],
                        backgroundColor: 'rgba(76, 175, 80, 0.7)'
                    },
                    {
                        label: 'MAE (tons)',
                        data: [0, 0, 0],
                        backgroundColor: 'rgba(33, 150, 243, 0.7)'
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Error (tons)'
                        }
                    }
                }
            }
        });
    }
    
    initializePredictionChart(ctx) {
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
                        tension: 0.3,
                        fill: false
                    },
                    {
                        label: 'Random Forest Predicted',
                        data: [],
                        borderColor: 'rgb(33, 150, 243)',
                        backgroundColor: 'rgba(33, 150, 243, 0.1)',
                        tension: 0.3,
                        fill: false,
                        borderDash: [5, 5]
                    },
                    {
                        label: 'Linear Regression Predicted',
                        data: [],
                        borderColor: 'rgb(255, 152, 0)',
                        backgroundColor: 'rgba(255, 152, 0, 0.1)',
                        tension: 0.3,
                        fill: false,
                        borderDash: [5, 5]
                    },
                    {
                        label: 'XGBoost Predicted',
                        data: [],
                        borderColor: 'rgb(156, 39, 176)',
                        backgroundColor: 'rgba(156, 39, 176, 0.1)',
                        tension: 0.3,
                        fill: false,
                        borderDash: [5, 5]
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Predicted vs Actual Waste Generation'
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Month Index'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Waste (tons)'
                        },
                        beginAtZero: false
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
            `${getMonthName(row.month)} ${row.year}`
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
}