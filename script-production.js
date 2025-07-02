/**
 * WeatherNow - Production Version
 * Uses backend API for secure API key handling
 * 
 * @author Weather App Team
 * @version 1.0.0
 */

// Production configuration
const CONFIG = {
    API_BASE_URL: '/api/weather', // Use our backend API
    TIMEOUT: 10000,
    APP_NAME: 'WeatherNow',
    VERSION: '1.0.0'
};

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
    setupEventListeners();
    elements.cityInput.focus();
    
    // Check if backend is available
    checkBackendHealth();
}

/**
 * Check if backend API is available
 */
async function checkBackendHealth() {
    try {
        const response = await fetch('/api/health');
        if (!response.ok) {
            showError('Backend service is not available. Please try again later.');
        }
    } catch (error) {
        console.warn('Backend health check failed:', error);
        // Don't show error immediately, let user try to use the app
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
 * Fetch weather data from backend API
 * @param {string} city - City name
 * @returns {Promise<Object>} Weather data
 */
async function fetchWeatherData(city) {
    const url = `${CONFIG.API_BASE_URL}?city=${encodeURIComponent(city)}`;
    
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
            const errorData = await response.json().catch(() => ({}));
            
            if (response.status === 404) {
                throw new Error('City not found. Please check the spelling and try again.');
            } else if (response.status === 500) {
                throw new Error('Weather service is temporarily unavailable. Please try again later.');
            } else {
                throw new Error(errorData.error || `Service error (${response.status}). Please try again later.`);
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
            <div class="temperature">${Math.round(temp)}°F</div>
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
                    <div class="detail-value">${Math.round(speed)} mph</div>
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

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getWeather,
        fetchWeatherData,
        displayWeatherData,
        showError
    };
}
