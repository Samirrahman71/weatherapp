/**
 * Configuration file for WeatherNow
 * Handles environment variables and app settings
 */

// For development - you can set your API key here temporarily
// In production, this would be handled by your server/build process
const CONFIG = {
    // OpenWeatherMap API configuration
    OPENWEATHER_API_KEY: '', // Add your API key here for development
    
    // API settings
    API_BASE_URL: 'https://api.openweathermap.org/data/2.5/weather',
    UNITS: 'imperial', // 'imperial' for Fahrenheit, 'metric' for Celsius
    TIMEOUT: 10000, // Request timeout in milliseconds
    
    // App settings
    APP_NAME: 'WeatherNow',
    VERSION: '1.0.0',
    
    // Local storage keys
    STORAGE_KEYS: {
        API_KEY: 'weatherApiKey',
        LAST_SEARCH: 'lastSearchedCity',
        PREFERRED_UNITS: 'preferredUnits'
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}

// Make available globally for browser
window.APP_CONFIG = CONFIG;
