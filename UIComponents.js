class UIComponents {
    constructor() {
        this.components = {};
    }
    
    createDatasetTable(dataset, limit = 12) {
        let tableHTML = `
            <table class="dataset-table">
                <thead>
                    <tr>
                        <th>Month</th>
                        <th>Year</th>
                        <th>Pop Density</th>
                        <th>Income Level</th>
                        <th>Urban Area</th>
                        <th>Rainfall</th>
                        <th>Temperature</th>
                        <th>Trucks</th>
                        <th>Recycling %</th>
                        <th>Waste (tons)</th>
                    </tr>
                </thead>
                <tbody>`;
        
        dataset.slice(0, limit).forEach(row => {
            tableHTML += `
                <tr>
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
                </tr>`;
        });
        
        tableHTML += `</tbody></table>`;
        return tableHTML;
    }
    
    createStatsCards(stats) {
        return `
            <div class="card-container">
                <div class="card">
                    <div class="card-body">
                        <h4>Waste Generation</h4>
                        <p><strong>Average:</strong> ${stats.avgWaste.toFixed(1)} tons/month</p>
                        <p><strong>Minimum:</strong> ${stats.minWaste} tons</p>
                        <p><strong>Maximum:</strong> ${stats.maxWaste} tons</p>
                        <p><strong>Range:</strong> ${stats.wasteRange.toFixed(1)} tons</p>
                    </div>
                </div>
                <div class="card">
                    <div class="card-body">
                        <h4>Time Period</h4>
                        <p><strong>Start:</strong> ${stats.startYear}</p>
                        <p><strong>End:</strong> ${stats.endYear}</p>
                        <p><strong>Total Records:</strong> ${stats.totalRecords}</p>
                        <p><strong>Time Span:</strong> ${stats.timeSpan} years</p>
                    </div>
                </div>
                <div class="card">
                    <div class="card-body">
                        <h4>Key Features</h4>
                        <p><strong>Avg Population:</strong> ${Math.round(stats.avgPopulation).toLocaleString()}</p>
                        <p><strong>Avg Income:</strong> ₱${Math.round(stats.avgIncome).toLocaleString()}</p>
                        <p><strong>Avg Rainfall:</strong> ${stats.avgRainfall.toFixed(1)} mm</p>
                        <p><strong>Avg Temperature:</strong> ${stats.avgTemperature.toFixed(1)}°C</p>
                    </div>
                </div>
            </div>`;
    }
    
    createFeatureImportanceBars(featureImportance) {
        let barsHTML = '';
        
        Object.entries(featureImportance).forEach(([feature, score]) => {
            const featureName = feature.charAt(0).toUpperCase() + feature.slice(1);
            barsHTML += `
                <div class="importance-bar">
                    <div class="importance-fill" data-feature="${feature}" style="width: ${score * 100}%">
                        ${featureName}: ${(score * 100).toFixed(1)}%
                    </div>
                </div>`;
        });
        
        return barsHTML;
    }
    
    createPredictionResultCards(predictions) {
        let cardsHTML = '';
        
        if (predictions.randomForest) {
            cardsHTML += `
                <div class="accuracy-card">
                    <h4>Random Forest</h4>
                    <div class="accuracy-value">${predictions.randomForest} tons</div>
                    <p>Predicted Waste (tons)</p>
                </div>`;
        }
        
        if (predictions.linearRegression) {
            cardsHTML += `
                <div class="accuracy-card">
                    <h4>Linear Regression</h4>
                    <div class="accuracy-value">${predictions.linearRegression} tons</div>
                    <p>Predicted Waste (tons)</p>
                </div>`;
        }
        
        if (predictions.xgBoost) {
            cardsHTML += `
                <div class="accuracy-card">
                    <h4>XGBoost</h4>
                    <div class="accuracy-value">${predictions.xgBoost} tons</div>
                    <p>Predicted Waste (tons)</p>
                </div>`;
        }
        
        return cardsHTML;
    }
}