class Utils {
    static updateProgressBar(percentage) {
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
            progressBar.textContent = `${percentage}%`;
        }
    }
    
    static logToTraining(message) {
        const trainingLog = document.getElementById('trainingLog');
        if (trainingLog) {
            const timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            trainingLog.innerHTML += `<div>[${timestamp}] ${message}</div>`;
            trainingLog.scrollTop = trainingLog.scrollHeight;
        }
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
    
    static loadDatasetTable(dataset, limit = 12) {
        const datasetBody = document.getElementById('datasetBody');
        if (!datasetBody) return;
        
        datasetBody.innerHTML = '';
        
        dataset.slice(0, limit).forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.month}</td>
                <td>${row.year}</td>
                <td>${row.population.toLocaleString()}</td>
                <td>₱${row.income.toLocaleString()}</td>
                <td>${row.urbanArea} km²</td>
                <td>${row.rainfall} mm</td>
                <td>${row.temperature}°C</td>
                <td>${row.trucks}</td>
                <td>${row.recycling}%</td>
                <td><strong>${row.waste} tons</strong></td>
            `;
            datasetBody.appendChild(tr);
        });
    }
    
    static updateStatistics(stats) {
        document.getElementById('avgWaste').textContent = stats.avgWaste.toFixed(1);
        document.getElementById('minWaste').textContent = stats.minWaste;
        document.getElementById('maxWaste').textContent = stats.maxWaste;
        document.getElementById('wasteRange').textContent = stats.wasteRange.toFixed(1);
        document.getElementById('startYear').textContent = stats.startYear;
        document.getElementById('endYear').textContent = stats.endYear;
        document.getElementById('totalRecords').textContent = stats.totalRecords;
        document.getElementById('timeSpan').textContent = stats.timeSpan;
        document.getElementById('avgPopulation').textContent = Math.round(stats.avgPopulation).toLocaleString();
        document.getElementById('avgIncome').textContent = `₱${Math.round(stats.avgIncome).toLocaleString()}`;
        document.getElementById('avgRainfall').textContent = stats.avgRainfall.toFixed(1);
        document.getElementById('avgTemperature').textContent = stats.avgTemperature.toFixed(1);
    }
    
    static updateFeatureCorrelations(correlations) {
        document.getElementById('corrPopulation').textContent = correlations.population.toFixed(3);
        document.getElementById('corrIncome').textContent = correlations.income.toFixed(3);
        document.getElementById('corrRainfall').textContent = correlations.rainfall.toFixed(3);
        document.getElementById('corrTemperature').textContent = correlations.temperature.toFixed(3);
        document.getElementById('corrTrucks').textContent = correlations.trucks.toFixed(3);
        document.getElementById('corrRecycling').textContent = correlations.recycling.toFixed(3);
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
        if (predictions.randomForest) {
            document.getElementById('rfPrediction').textContent = `${predictions.randomForest} tons`;
        }
        if (predictions.linearRegression) {
            document.getElementById('lrPrediction').textContent = `${predictions.linearRegression} tons`;
        }
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
    
    static downloadCSV(filename, csvData) {
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }
}