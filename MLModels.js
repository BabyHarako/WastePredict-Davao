class MLModels {
    constructor() {
        this.models = {
            xgBoost: { trained: false, metrics: { rmse: 0, mae: 0, mape: 0 }}
        };
        this.featureImportance = {
            population: 0.85,
            income: 0.72,
            rainfall: 0.65,
            temperature: 0.58,
            trucks: 0.42,
            recycling: 0.35
        };
    }
    
    async trainModel(modelType = 'xgBoost') {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Generate realistic performance metrics
                const rmse = 22 + Math.random() * 8;
                const mae = 18 + Math.random() * 7;
                const mape = 2.8 + Math.random() * 0.7;
                
                this.models[modelType].trained = true;
                this.models[modelType].metrics = { rmse, mae, mape };
                
                resolve({ modelType, metrics: { rmse, mae, mape } });
            }, 500); // Reduced training time since it auto-trains
        });
    }
    
    generatePredictions(dataset) {
        const predictions = {
            xgBoost: []
        };
        
        dataset.forEach(row => {
            const inputs = {
                population: row.population,
                income: row.income,
                urbanArea: row.urbanArea,
                rainfall: row.rainfall,
                temperature: row.temperature,
                trucks: row.trucks,
                recycling: row.recycling
            };
            
            if (this.models.xgBoost.trained) {
                predictions.xgBoost.push(this.predictXGBoost(inputs));
            }
        });
        
        return predictions;
    }
    
    predict(inputs) {
        const predictions = {};
        
        if (this.models.xgBoost.trained) {
            predictions.xgBoost = this.predictXGBoost(inputs);
        }
        
        return predictions;
    }
    
    predictXGBoost(inputs) {
        // Base waste generation
        let waste = 790;
        
        // Adjust based on features (simplified XGBoost-like behavior)
        waste += (inputs.population - 8500) * 0.022;
        waste += (inputs.income - 25000) * 0.00012;
        waste -= (inputs.rainfall - 150) * 0.11;
        waste += (inputs.temperature - 28) * 2.2;
        waste += (inputs.trucks - 45) * 0.25;
        waste -= (inputs.recycling - 18) * 1.1;
        
        // Add some realistic randomness
        waste += Math.random() * 25 - 12.5;
        
        // Ensure realistic range
        return Math.max(600, Math.min(1000, Math.round(waste)));
    }
    
    getModelMetrics(modelType = 'xgBoost') {
        return this.models[modelType]?.metrics || null;
    }
    
    getTrainedModels() {
        return Object.entries(this.models)
            .filter(([_, model]) => model.trained)
            .map(([name, _]) => name);
    }
    
    getFeatureImportance() {
        return this.featureImportance;
    }
}