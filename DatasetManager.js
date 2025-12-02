class DatasetManager {
    constructor() {
        this.dataset = [];
        this.stats = {};
        this.correlations = {};
        this.initializeDataset();
    }
    
    initializeDataset() {
        this.generateDavaoDataset();
        this.calculateStatistics();
        this.calculateCorrelations();
    }
    
    generateDavaoDataset() {
        const dataset = [];
        let year = 2013;
        let month = 1;
        
        const baseValues = {
            population: 8500, income: 25000, urbanArea: 280,
            rainfall: 150, temperature: 28, trucks: 45,
            recycling: 18, waste: 785
        };
        
        for (let i = 0; i < 144; i++) {
            if (month > 12) {
                month = 1;
                year++;
            }
            
            const isDrySeason = (month >= 1 && month <= 5) || month === 12;
            
            const population = baseValues.population + Math.random() * 2000 - 1000;
            const income = baseValues.income + Math.random() * 10000 - 5000;
            const rainfall = isDrySeason ? 
                (50 + Math.random() * 100) : 
                (150 + Math.random() * 200);
            const temperature = isDrySeason ? 
                (30 + Math.random() * 3) : 
                (27 + Math.random() * 2);
            const trucks = baseValues.trucks + Math.floor(Math.random() * 10) - 5;
            const recycling = baseValues.recycling + Math.random() * 10 - 5;
            
            let waste = baseValues.waste;
            waste += (population - baseValues.population) * 0.02;
            waste += (income - baseValues.income) * 0.0001;
            waste -= (rainfall - baseValues.rainfall) * 0.1;
            waste += (temperature - baseValues.temperature) * 2;
            waste += Math.random() * 50 - 25;
            
            waste = Math.max(620, Math.min(950, waste));
            
            dataset.push({
                id: i + 1,
                month: month,
                year: year,
                population: Math.round(population),
                income: Math.round(income),
                urbanArea: Math.round(baseValues.urbanArea + Math.random() * 40 - 20),
                rainfall: Math.round(rainfall),
                temperature: Math.round(temperature * 10) / 10,
                trucks: Math.max(30, Math.min(80, trucks)),
                recycling: Math.max(10, Math.min(35, Math.round(recycling * 10) / 10)),
                waste: Math.round(waste)
            });
            
            month++;
        }
        
        this.dataset = dataset;
    }
    
    calculateStatistics() {
        const wastes = this.dataset.map(row => row.waste);
        const populations = this.dataset.map(row => row.population);
        const incomes = this.dataset.map(row => row.income);
        const rainfalls = this.dataset.map(row => row.rainfall);
        const temperatures = this.dataset.map(row => row.temperature);
        
        const avgWaste = wastes.reduce((a, b) => a + b, 0) / wastes.length;
        const avgPopulation = populations.reduce((a, b) => a + b, 0) / populations.length;
        const avgIncome = incomes.reduce((a, b) => a + b, 0) / incomes.length;
        const avgRainfall = rainfalls.reduce((a, b) => a + b, 0) / rainfalls.length;
        const avgTemperature = temperatures.reduce((a, b) => a + b, 0) / temperatures.length;
        
        const minWaste = Math.min(...wastes);
        const maxWaste = Math.max(...wastes);
        const startYear = this.dataset[0].year;
        const endYear = this.dataset[this.dataset.length-1].year;
        
        this.stats = {
            totalRecords: this.dataset.length,
            startYear: startYear,
            endYear: endYear,
            timeSpan: endYear - startYear + 1,
            avgWaste: avgWaste,
            minWaste: minWaste,
            maxWaste: maxWaste,
            wasteRange: maxWaste - minWaste,
            avgPopulation: avgPopulation,
            avgIncome: avgIncome,
            avgRainfall: avgRainfall,
            avgTemperature: avgTemperature
        };
    }
    
    calculateCorrelations() {
        const features = ['population', 'income', 'rainfall', 'temperature', 'trucks', 'recycling'];
        const correlations = {};
        
        features.forEach(feature => {
            const featureValues = this.dataset.map(row => row[feature]);
            const wasteValues = this.dataset.map(row => row.waste);
            correlations[feature] = this.calculateCorrelation(featureValues, wasteValues);
        });
        
        this.correlations = correlations;
    }
    
    calculateCorrelation(x, y) {
        const n = x.length;
        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
        const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
        const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);
        
        const numerator = n * sumXY - sumX * sumY;
        const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
        
        return denominator === 0 ? 0 : numerator / denominator;
    }
    
    getDataset(limit = null) {
        // Auto-load notification
        if (limit && typeof Utils !== 'undefined') {
            setTimeout(() => {
                Utils.logToTraining('📊 Dataset auto-loaded on startup');
            }, 100);
        }
        return limit ? this.dataset.slice(0, limit) : this.dataset;
    }
    
    getStatistics() {
        return this.stats;
    }
    
    getFeatureCorrelations() {
        return this.correlations;
    }
    
    getCSVData() {
        const headers = ['Month', 'Year', 'Population Density', 'Income Level', 'Urban Area', 
                        'Rainfall', 'Temperature', 'Trucks', 'Recycling %', 'Waste (tons)'];
        
        let csv = headers.join(',') + '\n';
        
        this.dataset.forEach(row => {
            csv += `${row.month},${row.year},${row.population},${row.income},${row.urbanArea},`;
            csv += `${row.rainfall},${row.temperature},${row.trucks},${row.recycling},${row.waste}\n`;
        });
        
        return csv;
    }
}