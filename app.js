// Main Application Controller
class WastePredictApp {
    constructor() {
        // Check if required classes are loaded
        if (typeof DatasetManager === 'undefined' || 
            typeof MLModels === 'undefined' ||
            typeof Utils === 'undefined' ||
            typeof ChartManager === 'undefined') {
            
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
        this.initializeChart();
        this.autoLoadAndTrain();
    }
    
    setupEventListeners() {
        // Slide toggle
        document.getElementById('toggleSlidesBtn').addEventListener('click', () => this.toggleSlides());
        
        // Prediction control
        document.getElementById('predictBtn').addEventListener('click', () => this.handlePredict());
        
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.themeManager.toggleTheme());
        
        // Smooth scrolling for navigation links
        this.setupSmoothScrolling();
    }
    
    toggleSlides() {
        const mainSlide = document.getElementById('mainSlide');
        const analysisSlide = document.getElementById('analysisSlide');
        const toggleBtn = document.getElementById('toggleSlidesBtn');
        
        if (mainSlide.classList.contains('active')) {
            // Switch to analysis slide
            mainSlide.classList.remove('active');
            analysisSlide.classList.add('active');
            toggleBtn.textContent = 'View Prediction';
            
            // Scroll to top of analysis slide
            analysisSlide.scrollIntoView({ behavior: 'smooth' });
        } else {
            // Switch to main slide
            analysisSlide.classList.remove('active');
            mainSlide.classList.add('active');
            toggleBtn.textContent = 'View Analysis';
            
            // Scroll to top of main slide
            mainSlide.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    setupThemeChangeListener() {
        // Listen for theme changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-theme') {
                    const theme = document.documentElement.getAttribute('data-theme');
                    this.chartManager.updateTheme(theme);
                }
            });
        });
        
        observer.observe(document.documentElement, { attributes: true });
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
    
    initializeChart() {
        setTimeout(() => {
            const predictionCtx = document.getElementById('predictionChart');
            if (predictionCtx) {
                this.chartManager.initializePredictionChart(predictionCtx);
            }
        }, 100);
    }
    
    autoLoadAndTrain() {
        setTimeout(() => {
            this.handleLoadAndTrain();
        }, 300);
    }
    
    async handleLoadAndTrain() {
        try {
            // Load dataset
            const dataset = this.datasetManager.getDataset();
            
            // Auto-train XGBoost model
            await this.mlModels.trainModel('xgBoost');
            
            // Get model metrics
            const metrics = this.mlModels.getModelMetrics('xgBoost');
            if (metrics) {
                Utils.updateModelResults('xgb', metrics.rmse, metrics.mae, metrics.mape);
            }
            
            // Generate predictions for chart
            const predictions = this.mlModels.generatePredictions(dataset);
            this.chartManager.updatePredictionChart(dataset, predictions);
            
            // Update feature importance
            const featureImportance = this.mlModels.getFeatureImportance();
            Utils.updateFeatureImportance(featureImportance);
            
            console.log('✅ XGBoost model trained and ready for predictions!');
            
        } catch (error) {
            console.error('❌ Error:', error.message);
        }
    }
    
    handlePredict() {
        try {
            const trainedModels = this.mlModels.getTrainedModels();
            if (trainedModels.length === 0) {
                alert('⚠️ Model is training. Please wait a moment and try again.');
                return;
            }
            
            const inputs = Utils.getPredictionInputs();
            const predictions = this.mlModels.predict(inputs);
            
            Utils.showPredictionResults(predictions);
            
            // Re-train model with new data (simulated)
            this.retrainWithNewData(inputs, predictions.xgBoost);
            
            console.log(`Prediction: ${predictions.xgBoost} tons for ${this.getMonthName(inputs.month)} ${inputs.year}`);
            
        } catch (error) {
            alert(`❌ Error making predictions: ${error.message}`);
        }
    }
    
    async retrainWithNewData(inputs, predictedWaste) {
        // Simulate re-training with new data point
        setTimeout(async () => {
            await this.mlModels.trainModel('xgBoost');
            
            // Update metrics
            const metrics = this.mlModels.getModelMetrics('xgBoost');
            if (metrics) {
                Utils.updateModelResults('xgb', metrics.rmse, metrics.mae, metrics.mape);
            }
            
            // Update chart with new predictions
            const dataset = this.datasetManager.getDataset();
            const predictions = this.mlModels.generatePredictions(dataset);
            this.chartManager.updatePredictionChart(dataset, predictions);
            
            console.log('✅ Model re-trained with new prediction data');
        }, 800);
    }
    
    getMonthName(monthNumber) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[monthNumber - 1] || monthNumber;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app...');
    try {
        window.wastePredictApp = new WastePredictApp();
        console.log('✅ WastePredictApp initialized successfully!');
    } catch (error) {
        console.error('❌ Failed to create WastePredictApp:', error);
    }
});