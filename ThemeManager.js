class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.initializeTheme();
    }
    
    initializeTheme() {
        // Set initial theme
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.updateThemeIcon();
    }
    
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
        this.updateThemeIcon();
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
    
    getCurrentTheme() {
        return this.currentTheme;
    }
    
    isDarkMode() {
        return this.currentTheme === 'dark';
    }
}