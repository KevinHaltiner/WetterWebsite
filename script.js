document.getElementById("city").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        getWeather();
    }
});

// Funktion zur Formatierung der Sichtbarkeit
function formatVisibility(meters) {
    return meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${meters.toFixed(1)} m`;
}

// Funktion zur Aktualisierung des Hintergrunds basierend auf dem Wetter
function updateBackgroundColor(weatherData) {
    // Zeit & Wetter abrufen
    const utcTime = new Date().getTime();
    const localTime = new Date(utcTime + weatherData.timezone * 1000);
    const hour = localTime.getUTCHours();
    const weather = weatherData.weather[0].main.toLowerCase();

    let color1 = "", color2 = "";

    let isDaytime = hour >= 6 && hour < 18;

    if (isDaytime) {  
        if (weather.includes("clear")) {
            color1 = "#87CEFA"; 
            color2 = "#378acf"; 
        } else if (weather.includes("cloud")) {
            color1 = "#B0C4DE";  
            color2 = "#6a7f94";  
        } else if (weather.includes("rain")) {
            color1 = "#778899";  
            color2 = "#2f3e4e";  
        } else if (weather.includes("thunderstorm")) {
            color1 = "#36454F";  
            color2 = "#1c242b";  
        } else if (weather.includes("snow")) {
            color1 = "#ADD8E6";  
            color2 = "#B0E0E6";  
        } else if (weather.includes("mist")) {
            color1 = "#D3D3D3";  
            color2 = "#A9A9A9";  
        } else {
            color1 = "#ADD8E6";  
            color2 = "#5a89a7";  
        }
    } else {  
        if (weather.includes("clear")) {
            color1 = "#191970";  
            color2 = "#4169E1";  
        } else if (weather.includes("cloud")) {
            color1 = "#2F4F4F";  
            color2 = "#4f5b62";  
        } else if (weather.includes("rain")) {
            color1 = "#36454F";  
            color2 = "#1c242b";  
        } else if (weather.includes("thunderstorm")) {
            color1 = "#191970";  
            color2 = "#4169E1";  
        } else if (weather.includes("snow")) {
            color1 = "#2F4F4F";  
            color2 = "#4B0082";  
        } else if (weather.includes("mist")) {
            color1 = "#2F4F4F";  
            color2 = "#4B0082";  
        } else {
            color1 = "#1C1C1C";  
            color2 = "#333333";  
        }
    }

    document.body.style.backgroundImage = `linear-gradient(to bottom, ${color1}, ${color2})`;
    document.body.style.transition = "background-image 1s ease-in-out";

    const ic = document.querySelectorAll(".icons, .bottom, .search-bar input");
    ic.forEach(el => {
        if (!isDaytime) {
            el.style.background = "linear-gradient(to bottom,rgb(33, 32, 32),rgb(47, 47, 47))";
        } else {
            el.style.background = "linear-gradient(to bottom,rgb(182, 185, 187), #FFFFFF)";
        }
        el.style.transition = "background 1s ease-in-out, color 1s ease-in-out"; // Animation hinzufügen
    });

    if (!isDaytime) {
        document.body.style.color = "#FFFFFF";  // Weißer Text bei Nacht
    } else {
        document.body.style.color = "#000000";
    }

    // Farben der Boxen und Icons dynamisch ändern
    const elements = document.querySelectorAll(".box, .icon");
    elements.forEach(el => {
        if (!isDaytime) {
            el.style.color = "#FFFFFF";  // Weiße Schrift in dunklen Boxen
        } else {
            el.style.color = "#000000";  // Schwarzer Text am Tag
        }
        el.style.transition = "background-color 1s ease-in-out, color 0.5s ease-in-out"; // Animation hinzufügen
    });
}



// Funktion zur Anzeige eines Fehlers
function displayError(message) {
    document.getElementById('city-name').textContent = "Fehler";
    document.getElementById('temperature').textContent = message;
    ["feels", "humidity", "wind", "pressure", "max", "min", "cloud", "visibility"].forEach(id => {
        document.getElementById(id).textContent = "";
    });
    for (let i = 1; i <= 5; i++) {
        document.getElementById(`icon${i}`).innerHTML = "";
    }
}

// Funktion zur Anzeige des Wetters anhand der Geolocation
async function getWeather(city = null) {
    if (!city) {
        city = document.getElementById('city').value.trim();
    }

    if (!city) {
        alert("Bitte eine Stadt eingeben!");
        return;
    }

    const apiKey = '920991fa6edee1d6c8aa3c8e86d37869';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=de`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=de`;

    try {
        const [weatherResponse, forecastResponse] = await Promise.all([
            fetch(url),
            fetch(forecastUrl)
        ]);

        const weatherData = await weatherResponse.json();
        const forecastData = await forecastResponse.json();

        if (!weatherResponse.ok || forecastData.cod !== "200") {
            displayError(weatherData.message || "Daten konnten nicht geladen werden.");
            return;
        }
        console.log(weatherData.main.temp_max);
        console.log(weatherData.main.temp_min);
        // Aktuelle Wetterdaten anzeigen
        document.getElementById('city-name').textContent = `${weatherData.name}, ${weatherData.sys.country}`;
        document.getElementById('temperature').textContent = `${weatherData.main.temp.toFixed(1)}°C, ${weatherData.weather[0].description}`;
        document.getElementById('feels').textContent = `Gefühlt: ${weatherData.main.feels_like.toFixed(1)}°C`;
        document.getElementById('humidity').textContent = `Luftfeuchtigkeit: ${weatherData.main.humidity.toFixed(1)} %`;
        document.getElementById('wind').textContent = `Wind: ${weatherData.wind.speed.toFixed(1)} m/s`;
        document.getElementById('pressure').textContent = `${weatherData.main.pressure.toFixed(1)} hPa Luftdruck`;
        //document.getElementById('max').textContent = `Max ${weatherData.main.temp_max.toFixed(1)}°C`;
        //document.getElementById('min').textContent = `Min ${weatherData.main.temp_min.toFixed(1)}°C`;
        document.getElementById('cloud').textContent = `Bewölkung ${weatherData.clouds.all.toFixed(1)}%`;
        document.getElementById('visibility').textContent = formatVisibility(weatherData.visibility);
        document.getElementById('icon1').innerHTML = `<img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png" alt="${weatherData.weather[0].description}">`;
        updateBackgroundColor(weatherData);

        // 5-Tage-Vorhersage
        const forecastList = forecastData.list.filter(item => item.dt_txt.includes("12:00:00"));
        forecastList.forEach((day, index) => {
            const iconId = `icon${index + 1}`;
            const iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
            const temp = `${day.main.temp.toFixed(1)}°C`;
            const description = day.weather[0].description;
        
            const date = new Date(day.dt_txt);
            const options = { weekday: 'long', day: '2-digit', month: '2-digit' };
            const formattedDate = date.toLocaleDateString('de-DE', options);
        
            const iconElement = document.getElementById(iconId);
            if (iconElement) {
                iconElement.innerHTML = `
                    <p><strong>${formattedDate}</strong></p> 
                    <img src="${iconUrl}" alt="${description}">
                    <p>${temp}</p>
                    <p id="description">${description}</p>
                `;
            }
        });
        

    } catch (error) {
        console.error("Fehler:", error);
        displayError("Daten konnten nicht geladen werden.");
    }
}

// Funktion zur Anzeige des Wetters basierend auf der Geolocation des Benutzers
function getLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                console.log("Standort erfolgreich erhalten:", position);
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                console.log(`Latitude: ${lat}, Longitude: ${lon}`);
                
                const apiKey = "920991fa6edee1d6c8aa3c8e86d37869";
                const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=de`;
                const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=de`;
          
               
            try {
                const [weatherResponse, forecastResponse] = await Promise.all([
                    fetch(weatherUrl),
                    fetch(forecastUrl),
                ]);

                const weatherData = await weatherResponse.json();
                const forecastData = await forecastResponse.json();

                if (!weatherResponse.ok || forecastData.cod !== "200") {
                    displayError(weatherData.message || "Daten konnten nicht geladen werden.");
                    return;
                }

                // Aktuelle Wetterdaten anzeigen
                document.getElementById('city-name').textContent = `${weatherData.name}, ${weatherData.sys.country}`;
                document.getElementById('temperature').textContent = `${weatherData.main.temp.toFixed(1)}°C, ${weatherData.weather[0].description}`;
                document.getElementById('feels').textContent = `Gefühlt: ${weatherData.main.feels_like.toFixed(1)}°C`;
                document.getElementById('humidity').textContent = `Luftfeuchtigkeit: ${weatherData.main.humidity.toFixed(1)} %`;
                document.getElementById('wind').textContent = `Wind: ${weatherData.wind.speed.toFixed(1)} m/s`;
                document.getElementById('pressure').textContent = `${weatherData.main.pressure.toFixed(1)} hPa Luftdruck`;
                //document.getElementById('max').textContent = `Max ${weatherData.main.temp_max.toFixed(1)}°C`;
                //document.getElementById('min').textContent = `Min ${weatherData.main.temp_min.toFixed(1)}°C`;
                document.getElementById('cloud').textContent = `Bewölkung ${weatherData.clouds.all.toFixed(1)}%`;
                document.getElementById('visibility').textContent = formatVisibility(weatherData.visibility);
                document.getElementById('icon1').innerHTML = `<img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png" alt="${weatherData.weather[0].description}">`;

                updateBackgroundColor(weatherData);

                // 5-Tage-Vorhersage abrufen und anzeigen
                const forecastList = forecastData.list.filter(item => item.dt_txt.includes("12:00:00"));
                forecastList.forEach((day, index) => {
                    const iconId = `icon${index + 1}`;
                    const iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
                    const temp = `${day.main.temp.toFixed(1)}°C`;
                    const description = day.weather[0].description;

                    // Datum in Wochentag umwandeln
                    const date = new Date(day.dt_txt);
                    const options = { weekday: 'long', day: '2-digit', month: '2-digit' };
                    const formattedDate = date.toLocaleDateString('de-DE', options);

                    const iconElement = document.getElementById(iconId);
                    if (iconElement) {
                        iconElement.innerHTML = `
                            <p><strong>${formattedDate}</strong></p> 
                            <img src="${iconUrl}" alt="${description}">
                            <p>${temp}</p>
                            <p id="description">${description}</p>
                        `;
                    }
                });


            } catch (error) {
                console.error("Fehler:", error);
                displayError("Daten konnten nicht geladen werden.");
            }
        });
    } else {
        alert("Geolocation wird in diesem Browser nicht unterstützt.");
    }
}


// Beim Laden der Seite den Standort-Wetter abrufen
window.onload = function() {
    getLocationWeather();
};
