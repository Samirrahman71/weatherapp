/**
 * WeatherNow - Professional Weather Application
 * A modern, responsive weather app built with vanilla JavaScript
 * 
 * Features:
 * - Real-time weather data from OpenWeatherMap API
 * - Responsive design with smooth animations
 * - Error handling and loading states
 * - Detailed weather information display
 * 
 * @author Weather App Team
 * @version 1.0.0
 */

// Use configuration from config.js
const CONFIG = window.APP_CONFIG || {
    API_BASE_URL: 'https://api.openweathermap.org/data/2.5/weather',
    UNITS: 'imperial',
    TIMEOUT: 10000,
    STORAGE_KEYS: { API_KEY: 'weatherApiKey' }
};

// API Key handling - Check config first, then localStorage
let API_KEY = CONFIG.OPENWEATHER_API_KEY || localStorage.getItem(CONFIG.STORAGE_KEYS.API_KEY);

// DOM Elements
const elements = {
    cityInput: document.getElementById('cityInput'),
    searchBtn: document.getElementById('searchBtn'),
    weatherResult: document.getElementById('weatherResult'),
    loadingSpinner: document.getElementById('loadingSpinner')
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

/**
 * Initialize the application
 */
function initializeApp() {
    // Check for API key
    if (!API_KEY) {
        requestApiKey();
    }
    
    // Add event listeners
    setupEventListeners();
    
    // Focus on input field
    elements.cityInput.focus();
}

/**
 * Request API key from user
 */
function requestApiKey() {
    const key = prompt(
        'Welcome to WeatherNow!\n\n' +
        'To get started, you\'ll need a free API key from OpenWeatherMap.\n' +
        'Visit: https://openweathermap.org/api\n\n' +
        'Enter your API key below:'
    );
    
    if (key && key.trim()) {
        API_KEY = key.trim();
        localStorage.setItem(CONFIG.STORAGE_KEYS.API_KEY, API_KEY);
    } else {
        showError('API key is required to fetch weather data. Please refresh and try again.');
    }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Enter key support
    elements.cityInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            getWeather();
        }
    });
    
    // Clear results when input changes
    elements.cityInput.addEventListener('input', function() {
        if (elements.weatherResult.innerHTML) {
            elements.weatherResult.innerHTML = '';
        }
    });
}

/**
 * Main function to fetch and display weather data
 */
async function getWeather() {
    const city = elements.cityInput.value.trim();
    
    // Validation
    if (!city) {
        showError('Please enter a city name');
        return;
    }
    
    if (!API_KEY) {
        requestApiKey();
        if (!API_KEY) return;
    }
    
    // Show loading state
    showLoading(true);
    
    try {
        const weatherData = await fetchWeatherData(city);
        displayWeatherData(weatherData);
    } catch (error) {
        handleError(error);
    } finally {
        showLoading(false);
    }
}

/**
 * Fetch weather data from API
 * @param {string} city - City name
 * @returns {Promise<Object>} Weather data
 */
async function fetchWeatherData(city) {
    const url = `${CONFIG.API_BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${CONFIG.UNITS}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT);
    
    try {
        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('City not found. Please check the spelling and try again.');
            } else if (response.status === 401) {
                throw new Error('Invalid API key. Please check your API key and try again.');
            } else {
                throw new Error(`Weather service error (${response.status}). Please try again later.`);
            }
        }
        
        const data = await response.json();
        return data;
        
    } catch (error) {
        clearTimeout(timeoutId);
        
        if (error.name === 'AbortError') {
            throw new Error('Request timed out. Please check your internet connection and try again.');
        }
        
        throw error;
    }
}

/**
 * Display weather data in the UI
 * @param {Object} data - Weather data from API
 */
function displayWeatherData(data) {
    const {
        name,
        sys: { country },
        main: { temp, feels_like, humidity, pressure },
        weather: [{ description, icon }],
        wind: { speed },
        visibility
    } = data;
    
    const weatherHtml = `
        <div class="weather-card">
            <div class="city-name">${name}, ${country}</div>
            <div class="temperature">${Math.round(temp)}°${CONFIG.UNITS === 'imperial' ? 'F' : 'C'}</div>
            <div class="description">${description}</div>
            
            <div class="weather-details">
                <div class="detail-item">
                    <div class="detail-label">Feels Like</div>
                    <div class="detail-value">${Math.round(feels_like)}°</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Humidity</div>
                    <div class="detail-value">${humidity}%</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Wind Speed</div>
                    <div class="detail-value">${Math.round(speed)} ${CONFIG.UNITS === 'imperial' ? 'mph' : 'm/s'}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Pressure</div>
                    <div class="detail-value">${pressure} hPa</div>
                </div>
                ${visibility ? `
                <div class="detail-item">
                    <div class="detail-label">Visibility</div>
                    <div class="detail-value">${Math.round(visibility / 1000)} km</div>
                </div>
                ` : ''}
            </div>
        </div>
    `;
    
    elements.weatherResult.innerHTML = weatherHtml;
    
    // Add success animation
    elements.weatherResult.style.animation = 'none';
    elements.weatherResult.offsetHeight; // Trigger reflow
    elements.weatherResult.style.animation = 'slideIn 0.5s ease-out';
}

/**
 * Show loading state
 * @param {boolean} show - Whether to show loading
 */
function showLoading(show) {
    if (show) {
        elements.loadingSpinner.classList.remove('hidden');
        elements.weatherResult.innerHTML = '';
        elements.searchBtn.disabled = true;
        elements.searchBtn.style.opacity = '0.7';
    } else {
        elements.loadingSpinner.classList.add('hidden');
        elements.searchBtn.disabled = false;
        elements.searchBtn.style.opacity = '1';
    }
}

/**
 * Handle and display errors
 * @param {Error} error - Error object
 */
function handleError(error) {
    console.error('Weather App Error:', error);
    showError(error.message || 'An unexpected error occurred. Please try again.');
}

/**
 * Show error message
 * @param {string} message - Error message
 */
function showError(message) {
    elements.weatherResult.innerHTML = `
        <div class="error-message">
            <strong>⚠️ Error:</strong><br>
            ${message}
        </div>
    `;
}

// Utility function to get weather emoji based on condition
function getWeatherEmoji(weatherCode, isDay = true) {
    const weatherEmojis = {
        200: '⛈️', 201: '⛈️', 202: '⛈️', // Thunderstorm
        300: '🌦️', 301: '🌦️', 302: '🌦️', // Drizzle
        500: '🌧️', 501: '🌧️', 502: '🌧️', // Rain
        600: '🌨️', 601: '❄️', 602: '❄️', // Snow
        701: '🌫️', 711: '🌫️', 721: '🌫️', // Atmosphere
        800: isDay ? '☀️' : '🌙', // Clear
        801: isDay ? '🌤️' : '☁️', // Few clouds
        802: '⛅', 803: '☁️', 804: '☁️' // Clouds
    };
    
    return weatherEmojis[weatherCode] || '🌤️';
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getWeather,
        fetchWeatherData,
        displayWeatherData,
        showError
    };
}
