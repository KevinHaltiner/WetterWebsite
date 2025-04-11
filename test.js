async function getLocationWeather() {
  if (!navigator.geolocation) {
      alert("Geolocation wird in diesem Browser nicht unterstützt.");
      return;
  }

  // Standort abrufen
  navigator.geolocation.getCurrentPosition(
      async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          const apiKey = "920991fa6edee1d6c8aa3c8e86d37869";
          const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=de`;
          const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=de`;

          try {
              const [weatherResponse, forecastResponse] = await Promise.all([
                  fetch(weatherUrl),
                  fetch(forecastUrl),
              ]);

              if (!weatherResponse.ok || !forecastResponse.ok) {
                  throw new Error("Wetterdaten konnten nicht geladen werden.");
              }

              const weatherData = await weatherResponse.json();
              const forecastData = await forecastResponse.json();

              // Wetterdaten anzeigen
              updateWeatherUI(weatherData);
              updateForecastUI(forecastData);

          } catch (error) {
              console.error("Fehler beim Abrufen der Wetterdaten:", error);
              displayError("Daten konnten nicht geladen werden.");
          }
      },
      (error) => {
          console.error("Geolocation-Fehler:", error);
          alert("Standortabfrage fehlgeschlagen. Bitte manuell eingeben.");
      }
  );
}

// UI mit aktuellen Wetterdaten aktualisieren
function updateWeatherUI(weatherData) {
  document.getElementById("city-name").textContent = `${weatherData.name}, ${weatherData.sys.country}`;
  document.getElementById("temperature").textContent = `${weatherData.main.temp.toFixed(1)}°C, ${weatherData.weather[0].description}`;
  document.getElementById("feels").textContent = `Gefühlt: ${weatherData.main.feels_like.toFixed(1)}°C`;
  document.getElementById("humidity").textContent = `Luftfeuchtigkeit: ${weatherData.main.humidity}%`;
  document.getElementById("wind").textContent = `Wind: ${weatherData.wind.speed.toFixed(1)} m/s`;
  document.getElementById("pressure").textContent = `${weatherData.main.pressure} hPa Luftdruck`;
  document.getElementById("max").textContent = `Max ${weatherData.main.temp_max.toFixed(1)}°C`;
  document.getElementById("min").textContent = `Min ${weatherData.main.temp_min.toFixed(1)}°C`;
  document.getElementById("cloud").textContent = `Bewölkung ${weatherData.clouds.all}%`;
  document.getElementById("visibility").textContent = formatVisibility(weatherData.visibility);
  document.getElementById("icon1").innerHTML = `<img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png" alt="${weatherData.weather[0].description}">`;

  updateBackgroundColor(weatherData);
}

// UI mit 5-Tage-Wettervorhersage aktualisieren
function updateForecastUI(forecastData) {
  const forecastList = forecastData.list.filter(item => item.dt_txt.includes("12:00:00"));
  
  forecastList.forEach((day, index) => {
      const iconId = `icon${index + 1}`;
      const iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
      const temp = `${day.main.temp.toFixed(1)}°C`;
      const description = day.weather[0].description;

      const iconElement = document.getElementById(iconId);
      if (iconElement) {
          iconElement.innerHTML = `
              <img src="${iconUrl}" alt="${description}">
              <p>${temp}</p>
              <p id="description">${description}</p>
          `;
      }
  });
}

// Fehleranzeige
function displayError(message) {
  document.getElementById("city-name").textContent = "Fehler";
  document.getElementById("temperature").textContent = message;
  ["feels", "humidity", "wind", "pressure", "max", "min", "cloud", "visibility"].forEach(id => {
      document.getElementById(id).textContent = "";
  });
  for (let i = 1; i <= 5; i++) {
      document.getElementById(`icon${i}`).innerHTML = "";
  }
}

// Wetterdaten beim Laden der Seite abrufen
window.onload = function () {
  getLocationWeather();
};
