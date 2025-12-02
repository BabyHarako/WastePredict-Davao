class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.initializeTheme();
    }
    
    initializeTheme() {
        // Set initial theme
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.updateThemeIcon();
        
        // Update chart colors based on theme
        this.updateChartColors();
    }
    
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
        this.updateThemeIcon();
        this.updateChartColors();
        
        // Log theme change
        const themeName = this.currentTheme === 'dark' ? '🌙 Dark' : '☀️ Light';
        if (typeof Utils !== 'undefined') {
            Utils.logToTraining(`🎨 Theme changed to ${themeName} Mode`);
        }
    }
    
    updateThemeIcon() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (this.currentTheme === 'dark') {
                icon.className = 'fas fa-sun';
                themeToggle.title = 'Switch to Light Mode';
                themeToggle.setAttribute('aria-label', 'Switch to Light Mode');
            } else {
                icon.className = 'fas fa-moon';
                themeToggle.title = 'Switch to Dark Mode';
                themeToggle.setAttribute('aria-label', 'Switch to Dark Mode');
            }
        }
    }
    
    updateChartColors() {
        // Update chart colors based on theme
        const isDark = this.currentTheme === 'dark';
        const textColor = isDark ? '#e0e0e0' : '#333333';
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        
        // Update Chart.js default colors
        if (typeof Chart !== 'undefined') {
            Chart.defaults.color = textColor;
            Chart.defaults.borderColor = gridColor;
        }
    }
    
    getCurrentTheme() {
        return this.currentTheme;
    }
    
    isDarkMode() {
        return this.currentTheme === 'dark';
    }
}