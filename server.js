/**
 * WeatherNow Backend Server
 * Handles API key securely on the server side
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files (HTML, CSS, JS)
app.use(express.static('.'));

// API endpoint to get weather data
app.get('/api/weather', async (req, res) => {
    try {
        const { city } = req.query;
        
        if (!city) {
            return res.status(400).json({ error: 'City parameter is required' });
        }

        const API_KEY = process.env.OPENWEATHER_API_KEY;
        
        if (!API_KEY) {
            return res.status(500).json({ error: 'Server configuration error: API key not found' });
        }

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=imperial`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (!response.ok) {
            return res.status(response.status).json(data);
        }
        
        res.json(data);
        
    } catch (error) {
        console.error('Weather API Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve the main app
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🌤️ WeatherNow server running on port ${PORT}`);
    console.log(`📱 Open http://localhost:${PORT} to view the app`);
});

module.exports = app;
