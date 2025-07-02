# 🔧 WeatherNow Setup Guide

## ⚠️ Important: API Key Notice

The API key you provided (`sk-proj-...`) appears to be an **OpenAI API key**, but this weather app requires an **OpenWeatherMap API key**.

## 🌤️ Getting Your OpenWeatherMap API Key

1. **Visit OpenWeatherMap**: Go to [https://openweathermap.org/api](https://openweathermap.org/api)
2. **Sign Up**: Create a free account
3. **Generate API Key**: Go to your account dashboard and generate an API key
4. **Copy Your Key**: It will look something like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`

## 🛠️ Configuration Options

### Option 1: Using config.js (Recommended for Development)
1. Open `config.js`
2. Replace the empty string in `OPENWEATHER_API_KEY: ''` with your actual API key:
   ```javascript
   OPENWEATHER_API_KEY: 'your_actual_openweathermap_api_key_here'
   ```

### Option 2: Using .env file (For Advanced Users)
1. Open the `.env` file in the project root
2. Replace `your_openweathermap_api_key_here` with your actual API key:
   ```
   OPENWEATHER_API_KEY=your_actual_openweathermap_api_key_here
   ```

### Option 3: Runtime Input (Current Default)
- The app will prompt you for your API key when you first use it
- Your key will be saved in browser localStorage for future use

## 🚀 Testing Your Setup

1. Start the local server: `python3 -m http.server 8000`
2. Open your browser to `http://localhost:8000`
3. Enter a city name (e.g., "New York", "London", "Tokyo")
4. If configured correctly, you should see detailed weather information!

## 🔒 Security Notes

- The `.env` file is already in `.gitignore` to prevent accidental commits
- Never commit API keys to version control
- For production deployment, use environment variables or secure key management

## 🆘 Troubleshooting

**"Invalid API key" error?**
- Double-check your OpenWeatherMap API key
- Make sure you're using the correct API key (not OpenAI)
- Wait a few minutes after generating - new keys can take time to activate

**"City not found" error?**
- Try different city name formats: "New York", "London, UK", "Tokyo, JP"
- Check spelling and try major cities first

**App not loading?**
- Make sure the local server is running
- Check browser console for JavaScript errors
- Ensure all files are in the correct directory
