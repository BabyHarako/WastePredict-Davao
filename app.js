// Helper function for month names
function getMonthName(monthNumber) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[monthNumber - 1] || monthNumber;
}

// Helper function to get model prefix
function getModelPrefix(modelType) {
    switch(modelType) {
        case 'randomForest': return 'rf';
        case 'linearRegression': return 'lr';
        case 'xgBoost': return 'xgb';
        default: return '';
    }
}

// Fix for solveSimpleChallenge error
window.solveSimpleChallenge = function() {
    console.log('solveSimpleChallenge called - function disabled for this application');
    return true;
};

// Main Application Controller
class WastePredictApp {
    constructor() {
        // Check if required classes are loaded
        if (typeof DatasetManager === 'undefined' || 
            typeof MLModels === 'undefined' ||
            typeof ChartManager === 'undefined' ||
            typeof Utils === 'undefined') {
            
            console.error('Error: Required classes not loaded. Check script loading order.');
            throw new Error('Required classes not loaded');
        }
        
        console.log('Initializing WastePredictApp...');
        
        try {
            this.datasetManager = new DatasetManager();
            this.mlModels = new MLModels();
            this.chartManager = new ChartManager();
            this.themeManager = new ThemeManager();
            this.initializeApp();
        } catch (error) {
            console.error('Failed to initialize WastePredictApp:', error);
            throw error;
        }
    }
    
    initializeApp() {
        this.setupEventListeners();
        this.setupThemeChangeListener();
        this.initializeCharts();
        this.autoLoadDataset();
        
        Utils.logToTraining('🚀 WastePredict Davao Application Initialized');
        Utils.logToTraining('📊 System ready. Load dataset and start training...');
        Utils.logToTraining(`🎨 Current theme: ${this.themeManager.isDarkMode() ? '🌙 Dark' : '☀️ Light'} Mode`);
    }
    
    setupEventListeners() {
        // Dataset controls
        document.getElementById('loadDataset').addEventListener('click', () => this.handleLoadDataset());
        document.getElementById('viewStats').addEventListener('click', () => this.handleViewStats());
        document.getElementById('analyzeFeatures').addEventListener('click', () => this.handleAnalyzeFeatures());
        document.getElementById('exportData').addEventListener('click', () => this.handleExportData());
        
        // Model training controls
        document.getElementById('trainRF').addEventListener('click', () => this.handleTrainModel('randomForest'));
        document.getElementById('trainLR').addEventListener('click', () => this.handleTrainModel('linearRegression'));
        document.getElementById('trainXGB').addEventListener('click', () => this.handleTrainModel('xgBoost'));
        document.getElementById('trainAll').addEventListener('click', () => this.handleTrainAllModels());
        
        // Prediction control
        document.getElementById('predictBtn').addEventListener('click', () => this.handlePredict());
        
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.themeManager.toggleTheme());
        
        // Smooth scrolling for navigation links
        this.setupSmoothScrolling();
        
        // Remove any problematic onload handlers
        this.cleanupProblematicHandlers();
    }
    
    setupThemeChangeListener() {
        // Listen for theme changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-theme') {
                    const theme = document.documentElement.getAttribute('data-theme');
                    this.chartManager.updateTheme(theme);
                    
                    // Also update Chart.js defaults
                    this.updateChartJsDefaults(theme);
                    
                    // Log theme change
                    const themeName = theme === 'dark' ? '🌙 Dark' : '☀️ Light';
                    Utils.logToTraining(`🎨 Theme changed to ${themeName} Mode`);
                }
            });
        });
        
        observer.observe(document.documentElement, { attributes: true });
    }
    
    updateChartJsDefaults(theme) {
        const isDark = theme === 'dark';
        
        if (typeof Chart !== 'undefined') {
            Chart.defaults.color = isDark ? '#e0e0e0' : '#333333';
            Chart.defaults.borderColor = isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';
            
            // Update font for all charts
            Chart.defaults.font.family = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
            Chart.defaults.font.size = 12;
        }
    }
    
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    cleanupProblematicHandlers() {
        // Clear any problematic onload handlers
        if (window.onload && window.onload.toString().includes('solveSimpleChallenge')) {
            window.onload = null;
        }
        
        // Remove problematic attributes
        document.querySelectorAll('[onload*="solveSimpleChallenge"]').forEach(el => {
            el.removeAttribute('onload');
        });
    }
    
    initializeCharts() {
        setTimeout(() => {
            const correlationCtx = document.getElementById('correlationChart');
            const performanceCtx = document.getElementById('performanceChart');
            const predictionCtx = document.getElementById('predictionChart');
            
            if (correlationCtx) this.chartManager.initializeCorrelationChart(correlationCtx);
            if (performanceCtx) this.chartManager.initializePerformanceChart(performanceCtx);
            if (predictionCtx) this.chartManager.initializePredictionChart(predictionCtx);
            
            // Set initial Chart.js defaults
            this.updateChartJsDefaults(this.themeManager.getCurrentTheme());
        }, 100);
    }
    
    autoLoadDataset() {
        setTimeout(() => {
            this.handleLoadDataset();
        }, 500);
    }
    
    handleLoadDataset() {
        try {
            const dataset = this.datasetManager.getDataset(12);
            Utils.loadDatasetTable(dataset);
            
            // Hide stats and features containers
            document.getElementById('statsContainer').style.display = 'none';
            document.getElementById('featuresContainer').style.display = 'none';
            
            Utils.logToTraining(`✅ Dataset loaded: ${this.datasetManager.getDataset().length} monthly records (2013-2024)`);
            Utils.updateProgressBar(30);
            
        } catch (error) {
            Utils.logToTraining(`❌ Error loading dataset: ${error.message}`);
        }
    }
    
    handleViewStats() {
        try {
            const stats = this.datasetManager.getStatistics();
            Utils.updateStatistics(stats);
            
            const statsContainer = document.getElementById('statsContainer');
            const featuresContainer = document.getElementById('featuresContainer');
            
            if (statsContainer.style.display === 'block') {
                statsContainer.style.display = 'none';
                Utils.logToTraining('📊 Statistics hidden');
            } else {
                statsContainer.style.display = 'block';
                featuresContainer.style.display = 'none';
                Utils.logToTraining('📊 Dataset statistics displayed');
            }
            
            Utils.updateProgressBar(50);
            
        } catch (error) {
            Utils.logToTraining(`❌ Error viewing statistics: ${error.message}`);
        }
    }
    
    handleAnalyzeFeatures() {
        try {
            const correlations = this.datasetManager.getFeatureCorrelations();
            Utils.updateFeatureCorrelations(correlations);
            
            const statsContainer = document.getElementById('statsContainer');
            const featuresContainer = document.getElementById('featuresContainer');
            
            if (featuresContainer.style.display === 'block') {
                featuresContainer.style.display = 'none';
                Utils.logToTraining('🔍 Feature analysis hidden');
            } else {
                featuresContainer.style.display = 'block';
                statsContainer.style.display = 'none';
                Utils.logToTraining('🔍 Feature correlation analysis displayed');
            }
            
            Utils.updateProgressBar(70);
            
        } catch (error) {
            Utils.logToTraining(`❌ Error analyzing features: ${error.message}`);
        }
    }
    
    async handleTrainModel(modelType) {
        try {
            const dataset = this.datasetManager.getDataset();
            if (!dataset || dataset.length === 0) {
                Utils.logToTraining('⚠️ Please load dataset first');
                return;
            }
            
            Utils.logToTraining(`🤖 Training ${modelType} model...`);
            
            // Simulate training progress
            let progress = 0;
            const progressInterval = setInterval(() => {
                progress += 2;
                Utils.updateProgressBar(progress);
                
                if (progress >= 100) {
                    clearInterval(progressInterval);
                    
                    this.mlModels.trainModel(modelType).then(result => {
                        const { rmse, mae, mape } = result.metrics;
                        const modelPrefix = getModelPrefix(modelType);
                        Utils.updateModelResults(modelPrefix, rmse, mae, mape);
                        
                        const metrics = {
                            randomForest: this.mlModels.getModelMetrics('randomForest'),
                            linearRegression: this.mlModels.getModelMetrics('linearRegression'),
                            xgBoost: this.mlModels.getModelMetrics('xgBoost')
                        };
                        
                        this.chartManager.updatePerformanceChart(metrics);
                        
                        if (modelType === 'randomForest') {
                            const featureImportance = this.mlModels.getFeatureImportance();
                            Utils.updateFeatureImportance(featureImportance);
                        }
                        
                        const predictions = this.mlModels.generatePredictions(dataset);
                        this.chartManager.updatePredictionChart(dataset, predictions);
                        
                        Utils.logToTraining(`✅ ${modelType} training completed!`);
                        Utils.logToTraining(`   📏 RMSE: ${rmse.toFixed(2)} tons`);
                        Utils.logToTraining(`   📊 MAE: ${mae.toFixed(2)} tons`);
                        Utils.logToTraining(`   📉 MAPE: ${mape.toFixed(2)}%`);
                        Utils.logToTraining(`   🎯 Accuracy: ${Utils.calculateAccuracyFromMAPE(mape).toFixed(1)}%`);
                    });
                }
            }, 50);
            
        } catch (error) {
            Utils.logToTraining(`❌ Error training model: ${error.message}`);
        }
    }
    
    handleTrainAllModels() {
        this.handleTrainModel('randomForest');
        setTimeout(() => this.handleTrainModel('linearRegression'), 800);
        setTimeout(() => this.handleTrainModel('xgBoost'), 1600);
    }
    
    handlePredict() {
        try {
            const trainedModels = this.mlModels.getTrainedModels();
            if (trainedModels.length === 0) {
                Utils.logToTraining('⚠️ Please train at least one model first');
                return;
            }
            
            const inputs = Utils.getPredictionInputs();
            const predictions = this.mlModels.predict(inputs);
            
            Utils.showPredictionResults(predictions);
            
            Utils.logToTraining('✅ Predictions generated successfully!');
            Utils.logToTraining(`📅 For: ${getMonthName(inputs.month)} ${inputs.year}`);
            Utils.logToTraining(`📊 Input Parameters:`);
            Utils.logToTraining(`   • Population: ${inputs.population} people/km²`);
            Utils.logToTraining(`   • Income: ₱${Utils.formatNumber(inputs.income)}`);
            Utils.logToTraining(`   • Rainfall: ${inputs.rainfall} mm`);
            Utils.logToTraining(`   • Temperature: ${inputs.temperature}°C`);
            Utils.logToTraining(`   • Trucks: ${inputs.trucks} units`);
            Utils.logToTraining(`   • Recycling: ${inputs.recycling}%`);
            
            Object.entries(predictions).forEach(([model, value]) => {
                if (value) {
                    Utils.logToTraining(`   • ${model}: ${value} tons`);
                }
            });
            
        } catch (error) {
            Utils.logToTraining(`❌ Error making predictions: ${error.message}`);
        }
    }
    
    handleExportData() {
        try {
            const csvData = this.datasetManager.getCSVData();
            Utils.downloadCSV('wastepredict_davao_dataset.csv', csvData);
            Utils.logToTraining('📥 Dataset exported as CSV file');
        } catch (error) {
            Utils.logToTraining(`❌ Error exporting data: ${error.message}`);
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app...');
    try {
        // Initialize the app
        window.wastePredictApp = new WastePredictApp();
        console.log('✅ WastePredictApp initialized successfully!');
        
        // Log initialization
        const trainingLog = document.getElementById('trainingLog');
        if (trainingLog) {
            trainingLog.innerHTML = '<div>System ready. Load dataset and start training...</div>';
        }
    } catch (error) {
        console.error('❌ Failed to create WastePredictApp:', error);
        
        // Show user-friendly error
        const trainingLog = document.getElementById('trainingLog');
        if (trainingLog) {
            trainingLog.innerHTML = `
                <div style="color: red;">
                    <h3>❌ Application Error</h3>
                    <p>Failed to initialize the application.</p>
                    <p>Error: ${error.message}</p>
                    <p>Please make sure all JavaScript files are loaded correctly.</p>
                    <p>Check browser console for more details.</p>
                </div>
            `;
        }
    }
});