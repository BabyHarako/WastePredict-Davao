class Utils {
    static logToTraining(message) {
        // Log removed as per request
        console.log(message);
    }
    
    static calculateAccuracyFromMAPE(mape) {
        return Math.max(0, 100 - mape);
    }
    
    static getAccuracyClass(value) {
        if (value > 95) return 'high-accuracy';
        if (value > 90) return 'medium-accuracy';
        return 'low-accuracy';
    }
    
    static updateModelResults(modelPrefix, rmse, mae, mape) {
        const accuracy = this.calculateAccuracyFromMAPE(mape);
        
        const accuracyElement = document.getElementById(`${modelPrefix}Accuracy`);
        const rmseElement = document.getElementById(`${modelPrefix}RMSE`);
        const maeElement = document.getElementById(`${modelPrefix}MAE`);
        const mapeElement = document.getElementById(`${modelPrefix}MAPE`);
        
        if (accuracyElement) {
            accuracyElement.textContent = `${accuracy.toFixed(1)}%`;
            accuracyElement.className = `accuracy-value ${this.getAccuracyClass(accuracy)}`;
        }
        
        if (rmseElement) rmseElement.textContent = rmse.toFixed(2);
        if (maeElement) maeElement.textContent = mae.toFixed(2);
        if (mapeElement) mapeElement.textContent = mape.toFixed(2);
    }
    
    static getPredictionInputs() {
        return {
            population: parseFloat(document.getElementById('population').value) || 8500,
            income: parseFloat(document.getElementById('income').value) || 25000,
            urbanArea: parseFloat(document.getElementById('urbanArea').value) || 280,
            rainfall: parseFloat(document.getElementById('rainfall').value) || 150,
            temperature: parseFloat(document.getElementById('temperature').value) || 28,
            trucks: parseFloat(document.getElementById('trucks').value) || 45,
            recycling: parseFloat(document.getElementById('recycling').value) || 18,
            month: parseInt(document.getElementById('month').value) || 1,
            year: parseInt(document.getElementById('year').value) || 2024
        };
    }
    
    static showPredictionResults(predictions) {
        if (predictions.xgBoost) {
            document.getElementById('xgbPrediction').textContent = `${predictions.xgBoost} tons`;
        }
        
        const resultElement = document.getElementById('predictionResult');
        if (resultElement) {
            resultElement.style.display = 'block';
            resultElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
    
    static formatNumber(num) {
        return num.toLocaleString();
    }
    
    static updateFeatureImportance(featureImportance) {
        Object.entries(featureImportance).forEach(([feature, score]) => {
            const bars = document.querySelectorAll(`.importance-fill[data-feature="${feature}"]`);
            bars.forEach(bar => {
                setTimeout(() => {
                    bar.style.width = `${score * 100}%`;
                    bar.textContent = `${feature.charAt(0).toUpperCase() + feature.slice(1)}: ${(score * 100).toFixed(1)}%`;
                }, 200);
            });
        });
    }
}