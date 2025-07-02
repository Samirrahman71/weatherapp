// Simple weather app using OpenWeatherMap API
// Made for school project or portfolio use

// IMPORTANT: For security, in a real app you would use environment variables
// Get your own API key from: https://openweathermap.org/api
const API_KEY = prompt('Enter your OpenWeatherMap API key (this is just for demo purposes):');
// In a production app, you'd use environment variables instead of prompting the user

async function getWeather() {
  const city = document.getElementById('cityInput').value;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=imperial`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.cod === 200) {
      const output = `
        <p><strong>${data.name}</strong></p>
        <p>🌡️ ${data.main.temp} °F</p>
        <p>${data.weather[0].description}</p>
      `;
      document.getElementById('weatherResult').innerHTML = output;
    } else {
      document.getElementById('weatherResult').textContent = 'City not found.';
    }
  } catch (err) {
    document.getElementById('weatherResult').textContent = 'Something went wrong.';
  }
}
