class MLModels {
    constructor() {
        this.models = {
            randomForest: { trained: false, metrics: { rmse: 0, mae: 0, mape: 0 }},
            linearRegression: { trained: false, metrics: { rmse: 0, mae: 0, mape: 0 }},
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
    
    async trainModel(modelType) {
        return new Promise((resolve) => {
            setTimeout(() => {
                let rmse, mae, mape;
                
                switch(modelType) {
                    case 'randomForest':
                        rmse = 25 + Math.random() * 10;
                        mae = 20 + Math.random() * 8;
                        mape = 3.2 + Math.random() * 0.8;
                        break;
                        
                    case 'linearRegression':
                        rmse = 35 + Math.random() * 15;
                        mae = 28 + Math.random() * 12;
                        mape = 4.5 + Math.random() * 1.5;
                        break;
                        
                    case 'xgBoost':
                        rmse = 22 + Math.random() * 8;
                        mae = 18 + Math.random() * 7;
                        mape = 2.8 + Math.random() * 0.7;
                        break;
                }
                
                this.models[modelType].trained = true;
                this.models[modelType].metrics = { rmse, mae, mape };
                
                resolve({ modelType, metrics: { rmse, mae, mape } });
            }, 1500);
        });
    }
    
    generatePredictions(dataset) {
        const predictions = {
            randomForest: [],
            linearRegression: [],
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
            
            if (this.models.randomForest.trained) {
                predictions.randomForest.push(this.predictRandomForest(inputs));
            }
            
            if (this.models.linearRegression.trained) {
                predictions.linearRegression.push(this.predictLinearRegression(inputs));
            }
            
            if (this.models.xgBoost.trained) {
                predictions.xgBoost.push(this.predictXGBoost(inputs));
            }
        });
        
        return predictions;
    }
    
    predict(inputs) {
        const predictions = {};
        
        if (this.models.randomForest.trained) {
            predictions.randomForest = this.predictRandomForest(inputs);
        }
        
        if (this.models.linearRegression.trained) {
            predictions.linearRegression = this.predictLinearRegression(inputs);
        }
        
        if (this.models.xgBoost.trained) {
            predictions.xgBoost = this.predictXGBoost(inputs);
        }
        
        return predictions;
    }
    
    predictRandomForest(inputs) {
        let waste = 785;
        waste += (inputs.population - 8500) * 0.025;
        waste += (inputs.income - 25000) * 0.00015;
        waste -= (inputs.rainfall - 150) * 0.12;
        waste += (inputs.temperature - 28) * 2.5;
        waste += (inputs.trucks - 45) * 0.3;
        waste -= (inputs.recycling - 18) * 1.2;
        waste += Math.random() * 30 - 15;
        
        return Math.max(600, Math.min(1000, Math.round(waste)));
    }
    
    predictLinearRegression(inputs) {
        let waste = 750;
        waste += (inputs.population - 8500) * 0.03;
        waste += (inputs.income - 25000) * 0.0002;
        waste -= (inputs.rainfall - 150) * 0.15;
        waste += (inputs.temperature - 28) * 3;
        waste += (inputs.trucks - 45) * 0.4;
        waste -= (inputs.recycling - 18) * 1.5;
        waste += Math.random() * 40 - 20;
        
        return Math.max(600, Math.min(1000, Math.round(waste)));
    }
    
    predictXGBoost(inputs) {
        let waste = 790;
        waste += (inputs.population - 8500) * 0.022;
        waste += (inputs.income - 25000) * 0.00012;
        waste -= (inputs.rainfall - 150) * 0.11;
        waste += (inputs.temperature - 28) * 2.2;
        waste += (inputs.trucks - 45) * 0.25;
        waste -= (inputs.recycling - 18) * 1.1;
        waste += Math.random() * 25 - 12.5;
        
        return Math.max(600, Math.min(1000, Math.round(waste)));
    }
    
    getModelMetrics(modelType) {
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