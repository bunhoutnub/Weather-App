document.getElementById("getWeather").addEventListener("click", getWeather);
document.getElementById("saveCity").addEventListener("click", saveCurrentCity);

// Add Enter key support
document.getElementById("city").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    getWeather();
  }
});

// Load saved cities on page load
let savedCities = JSON.parse(localStorage.getItem("savedCities")) || [];
let currentCity = "";

async function displaySavedCities() {
  const citiesList = document.getElementById("citiesList");
  if (savedCities.length === 0) {
    citiesList.innerHTML = '<p style="color: #888; font-size: 0.9em;">No saved cities yet</p>';
    return;
  }
  
  // Fetch weather for all saved cities
  const apiKey = "841db7af533f08223c97eabe15252050";
  const cityTags = await Promise.all(savedCities.map(async (city) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.cod === 200) {
        const fahrenheit = Math.ceil((data.main.temp * 9) / 5 + 32);
        return `
          <div class="city-tag" onclick="loadCity('${city}')">
            <span>${city} ${fahrenheit}°F</span>
            <span class="remove" onclick="event.stopPropagation(); removeCity('${city}')">×</span>
          </div>
        `;
      }
    } catch (error) {
      return `
        <div class="city-tag" onclick="loadCity('${city}')">
          <span>${city}</span>
          <span class="remove" onclick="event.stopPropagation(); removeCity('${city}')">×</span>
        </div>
      `;
    }
  }));
  
  citiesList.innerHTML = cityTags.join('');
}

function saveCurrentCity() {
  if (currentCity && !savedCities.includes(currentCity)) {
    savedCities.push(currentCity);
    localStorage.setItem("savedCities", JSON.stringify(savedCities));
    displaySavedCities();
    alert(`${currentCity} saved!`);
  } else if (savedCities.includes(currentCity)) {
    alert("City already saved!");
  }
}

function removeCity(city) {
  savedCities = savedCities.filter(c => c !== city);
  localStorage.setItem("savedCities", JSON.stringify(savedCities));
  displaySavedCities();
}

function loadCity(city) {
  document.getElementById("city").value = city;
  getWeather();
}

// Weather icon mapping
function getWeatherIcon(weatherMain) {
  const icons = {
    'Clear': '☀️',
    'Clouds': '☁️',
    'Rain': '🌧️',
    'Drizzle': '🌦️',
    'Thunderstorm': '⛈️',
    'Snow': '❄️',
    'Mist': '🌫️',
    'Fog': '🌫️',
    'Haze': '🌫️'
  };
  return icons[weatherMain] || '🌤️';
}

async function getWeather() {
  let city = document.getElementById("city").value.trim();
  if (city === "") {
    alert("Please enter a city name!!");
    return;
  }

  // Show loading, hide results and errors
  document.getElementById("loading").style.display = "block";
  document.getElementById("weatherResult").style.display = "none";
  document.getElementById("errorMessage").style.display = "none";
  document.getElementById("saveCity").style.display = "none";

  let stateCode = "";
  // Convert "Columbus, GA" or "Columbus, Ga" to "Columbus,GA,US"
  if (city.includes(",")) {
    const parts = city.split(",").map(p => p.trim());
    if (parts.length === 2 && parts[1].length === 2) {
      // Assume it's "City, State" format, add US and uppercase state code
      stateCode = parts[1].toUpperCase();
      city = `${parts[0]},${stateCode},US`;
    }
  }

  const apiKey = "841db7af533f08223c97eabe15252050";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    // Hide loading
    document.getElementById("loading").style.display = "none";
    
    if (data.cod === "404") {
      document.getElementById("errorMessage").style.display = "block";
      return;
    }

    const celcius = data.main.temp;
    const fahrenheit = Math.ceil((celcius * 9) / 5 + 32);
    const locationDisplay = stateCode ? `${data.name}, ${stateCode}` : `${data.name}, ${data.sys.country}`;
    const weatherIcon = getWeatherIcon(data.weather[0].main);

    currentCity = locationDisplay;

    // Update weather result with new structure
    document.getElementById("weatherIcon").textContent = weatherIcon;
    document.getElementById("cityName").textContent = locationDisplay;
    document.getElementById("weatherDescription").textContent = data.weather[0].description;
    document.getElementById("temperature").textContent = `${fahrenheit}°F`;
    document.getElementById("humidity").textContent = `${data.main.humidity}%`;
    document.getElementById("windSpeed").textContent = `${data.wind.speed} m/s`;
    
    document.getElementById("weatherResult").style.display = "block";
    document.getElementById("saveCity").style.display = "inline-block";
  } catch (error) {
    document.getElementById("loading").style.display = "none";
    document.getElementById("errorMessage").style.display = "block";
  }
}

// Display saved cities on load
displaySavedCities();
