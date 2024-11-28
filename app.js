// DOM Elements
const CityInput = document.getElementById('CityInput');
const Search = document.getElementById('Search');
const apikey = '14de5eeefee62daa50432bc041b1dd13';

let CityName = document.getElementById('CityName');
let Temp = document.getElementById('Temp');
let Condition = document.getElementById('Condition');
let HumidityPercentage = document.getElementById('HumidityPercentage');
let WindSpeed = document.getElementById('WindSpeed');
let DateElement = document.getElementById('Date');
let WeatherImage = document.getElementById('WeatherImage');

const DefaultSection = document.getElementById('DefaultSection');
const MainSection = document.getElementById('MainSection');
const ForecastContainer = document.getElementById('ForecastContainer');

// Fetch Weather Data
async function getFetchData(endpoint, city) {
    const apiurl = `https://api.openweathermap.org/data/2.5/${endpoint}?q=${city}&appid=${apikey}&units=metric`;
    try {
        const response = await fetch(apiurl);
        if (!response.ok) throw new Error('Failed to fetch weather data');
        return response.json();
    } catch (error) {
        console.error(error.message);
        alert(error.message);
        return null;
    }
}

// Update Current Weather
async function updateWeatherInfo(city) {
    const weatherData = await getFetchData('weather', city);
    if (!weatherData) return;

    CityName.innerHTML = weatherData.name;
    Temp.innerHTML = Math.floor(weatherData.main.temp) + ' &deg;C';
    Condition.innerHTML = weatherData.weather[0].main;
    HumidityPercentage.innerHTML = weatherData.main.humidity + '%';
    WindSpeed.innerHTML = weatherData.wind.speed + ' M/s';

    const timestamp = weatherData.dt;
    const date = new Date(timestamp * 1000);
    DateElement.innerHTML = date.toLocaleDateString('en-US', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
    });

    WeatherImage.src = getWeatherIcon(weatherData.weather[0].id);

    DefaultSection.classList.add('hidden');
    MainSection.classList.remove('hidden');
}

// Update 5-Day Forecast
async function updateForecast(city) {
    const forecastData = await getFetchData('forecast', city);
    if (!forecastData) return;

    ForecastContainer.innerHTML = ''; // Clear previous forecasts

    const dailyForecasts = {};
    forecastData.list.forEach((entry) => {
        const date = new Date(entry.dt * 1000);
        const formattedDate = date.toLocaleDateString('en-US', {
            month: 'short',  // Abbreviated month (e.g., 'Nov')
            day: '2-digit',  // Day as two digits (e.g., '28')
        });
        if (!dailyForecasts[formattedDate]) {
            dailyForecasts[formattedDate] = entry;
        }
    });

    Object.entries(dailyForecasts)
        .slice(0, 5)
        .forEach(([date, forecast]) => {
            const temp = Math.round(forecast.main.temp);
            const weatherIcon = getWeatherIcon(forecast.weather[0].id);

            const forecastCard = `
                <div class="forecast">
                    <p>${date}</p>
                    <img src="${weatherIcon}" alt="Weather Icon">
                    <p>${temp} &deg;C</p>
                </div>
            `;
            ForecastContainer.innerHTML += forecastCard;
        });
}

// Get Weather Icon
function getWeatherIcon(id) {
    const iconBasePath = './Assets/animated/';
    if (id <= 232) return `${iconBasePath}thunder.svg`;
    if (id <= 321) return `${iconBasePath}rainy-1.svg`;
    if (id <= 531) return `${iconBasePath}rainy-7.svg`;
    if (id <= 622) return `${iconBasePath}snowy-3.svg`;
    if (id <= 781) return `${iconBasePath}snowy-6.svg`;
    if (id === 800) return `${iconBasePath}day.svg`;
    return `${iconBasePath}cloudy-day-3.svg`;
}

// Event Listeners
Search.addEventListener('click', () => {
    if (CityInput.value.trim() !== '') {
        updateWeatherInfo(CityInput.value);
        updateForecast(CityInput.value);
        CityInput.value = '';
    }
});

CityInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && CityInput.value.trim() !== '') {
        updateWeatherInfo(CityInput.value);
        updateForecast(CityInput.value);
        CityInput.value = '';
    }
});
