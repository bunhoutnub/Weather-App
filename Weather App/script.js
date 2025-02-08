document.getElementById("getWeather").addEventListener("click", getWeather);
async function getWeather() {
  const city = document.getElementById("city").value;
  if (city === " ") {
    alert("Please enter a city name!!");
  }

  const apiKey = "841db7af533f08223c97eabe15252050";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    console.log("Temperature: ", data.main.temp);
    const celcius = data.main.temp;
    const fahrenheit = Math.ceil((celcius * 9) / 5 + 32);
    if (data.cod === "404") {
      alert("City not found.");
      return;
    }

    const weatherInfo = `
      <h2>${data.name}, ${data.sys.country}</h2>
      <p><strong>Weather:</strong> ${data.weather[0].description}</p>
      <p><strong>Temperature:</strong> ${fahrenheit} °F</p>
      <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
      <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
    `;

    document.getElementById("weatherResult").innerHTML = weatherInfo;
  } catch (error) {
    alert("Something went wrong. Please try again.");
  }
}
