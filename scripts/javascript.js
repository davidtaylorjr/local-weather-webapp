var weatherData = {
    temp: null,
    celsius: null,
    tempFeel: null,
    tempFeelCelsius: null,
    description: null,
    precipChance: null
};

function getWeatherDescription(code, isDay) {
    if (code === 0) return isDay ? 'Clear' : 'Clear Night';
    if (code === 1) return 'Mainly Clear';
    if (code === 2) return 'Partly Cloudy';
    if (code === 3) return 'Overcast';
    if (code === 45 || code === 48) return 'Foggy';
    if (code >= 51 && code <= 55) return 'Drizzle';
    if (code >= 61 && code <= 65) return 'Rain';
    if (code >= 71 && code <= 77) return 'Snow';
    if (code >= 80 && code <= 82) return 'Rain Showers';
    if (code >= 85 && code <= 86) return 'Snow Showers';
    if (code === 95) return 'Thunderstorm';
    if (code >= 96) return 'Thunderstorm with Hail';
    return 'Unknown';
}

function getWeatherIcon(code, isDay) {
    if (code === 0) return isDay ? 'wi-day-sunny' : 'wi-night-clear';
    if (code <= 2) return isDay ? 'wi-day-cloudy' : 'wi-night-alt-cloudy';
    if (code === 3) return 'wi-cloudy';
    if (code === 45 || code === 48) return 'wi-fog';
    if (code >= 51 && code <= 65) return 'wi-showers';
    if (code >= 71 && code <= 86) return 'wi-snow';
    if (code === 95) return 'wi-storm-showers';
    if (code >= 96) return 'wi-hail';
    return 'wi-cloudy';
}

function geoLocation() {
    var output = document.getElementById("out");

    if (!navigator.geolocation) {
        output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
        return;
    }

    document.getElementById("userAddress").innerHTML = "<p>Grabbing Your Location...</p>";

    navigator.geolocation.getCurrentPosition(function(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;

        document.getElementById("conditions").innerHTML = "<p>Loading weather data...</p>";

        // Reverse geocoding via Nominatim (OpenStreetMap) — no API key required
        $.ajax({
            url: 'https://nominatim.openstreetmap.org/reverse',
            data: { lat: latitude, lon: longitude, format: 'json' },
            dataType: 'json',
            timeout: 8000,
            success: function(geo) {
                try {
                    var addr = (geo && geo.address) ? geo.address : {};
                    var city = addr.city || addr.town || addr.village || addr.county;
                    var region = addr.state ? ', ' + addr.state : '';
                    var location = city ? (city + region) : (geo.display_name || (latitude.toFixed(4) + ', ' + longitude.toFixed(4)));
                    document.getElementById("userAddress").innerHTML = "<p>Current conditions for " + location + "</p>";
                } catch(e) {
                    document.getElementById("userAddress").innerHTML = "<p>Current conditions for " + latitude.toFixed(4) + ", " + longitude.toFixed(4) + "</p>";
                }
            },
            error: function() {
                document.getElementById("userAddress").innerHTML = "<p>Current conditions for " + latitude.toFixed(4) + ", " + longitude.toFixed(4) + "</p>";
            }
        });

        // Weather data from Open-Meteo — free, no API key required
        var apiUrl = 'https://api.open-meteo.com/v1/forecast' +
            '?latitude=' + latitude +
            '&longitude=' + longitude +
            '&current=temperature_2m,apparent_temperature,precipitation_probability,weather_code,is_day' +
            '&daily=weather_code,temperature_2m_max,temperature_2m_min' +
            '&temperature_unit=fahrenheit&timezone=auto&forecast_days=7';

        $.ajax({
            url: apiUrl,
            dataType: 'json',
            timeout: 15000,
            success: function(data) {
                try {
                    var current = data.current;
                    var temp = current.temperature_2m;
                    var tempFeel = current.apparent_temperature;
                    var weatherCode = current.weather_code;
                    var isDay = current.is_day === 1;
                    var precipChance = current.precipitation_probability + "%";
                    var celsius = Math.round((temp - 32) * (5 / 9));
                    var tempFeelCelsius = Math.round((tempFeel - 32) * (5 / 9));
                    var description = getWeatherDescription(weatherCode, isDay);

                    // Today's overview from daily data (index 0)
                    var todayCode = data.daily.weather_code[0];
                    var hourlyDescription = "Expect " + getWeatherDescription(todayCode, true).toLowerCase() + " conditions throughout today.";

                    // Build day-by-day extended forecast (skip today at index 0)
                    var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    var extParts = [];
                    for (var i = 1; i < data.daily.time.length; i++) {
                        var d = new Date(data.daily.time[i] + 'T12:00:00');
                        var dayName = dayNames[d.getDay()];
                        var desc = getWeatherDescription(data.daily.weather_code[i], true).toLowerCase();
                        var hi = Math.round(data.daily.temperature_2m_max[i]);
                        var lo = Math.round(data.daily.temperature_2m_min[i]);
                        extParts.push(dayName + ": " + desc + " (" + hi + "°F / " + lo + "°F)");
                    }

                    weatherData.temp = temp;
                    weatherData.celsius = celsius;
                    weatherData.tempFeel = tempFeel;
                    weatherData.tempFeelCelsius = tempFeelCelsius;
                    weatherData.description = description;
                    weatherData.precipChance = precipChance;

                    document.getElementById("conditions").innerHTML =
                        "<p>It is currently " + Math.round(temp) + " °F and " + description +
                        "<br><br>Chance of precipitation is " + precipChance + "</p>";

                    if (Math.round(temp) !== Math.round(tempFeel)) {
                        document.getElementById("variables").innerHTML =
                            "<p>It feels like it is " + Math.round(tempFeel) + " °F.</p>";
                    }

                    document.getElementById("twentyfour").innerHTML = "<p>" + hourlyDescription + "</p>";

                    document.getElementById("extended").innerHTML =
                        "<p>Your extended forecast: " + extParts.join(" &bull; ") + "</p>";

                    var iconClass = getWeatherIcon(weatherCode, isDay);
                    document.getElementById("weathercon").innerHTML = '<i class="wi ' + iconClass + '"></i>';

                } catch(e) {
                    document.getElementById("conditions").innerHTML = "<p>Error displaying weather: " + e.message + "</p>";
                }
            },
            error: function(jqXHR, textStatus) {
                document.getElementById("conditions").innerHTML = "<p>Unable to load weather data (" + textStatus + "). Please refresh the page.</p>";
            }
        });

    }, function() {
        output.innerHTML = "<p>Unable to retrieve your location. Please allow location access and refresh.</p>";
    });
}

function convertC() {
    if (weatherData.temp === null) return;
    document.getElementById("conditions").innerHTML =
        "<p>It is currently " + weatherData.celsius + " °C and " + weatherData.description +
        "<br><br>Chance of precipitation is " + weatherData.precipChance + "</p>";

    if (Math.round(weatherData.temp) !== Math.round(weatherData.tempFeel)) {
        document.getElementById("variables").innerHTML =
            "<p>It feels like it is " + weatherData.tempFeelCelsius + " °C.</p>";
    }
}

function convertF() {
    if (weatherData.temp === null) return;
    document.getElementById("conditions").innerHTML =
        "<p>It is currently " + Math.round(weatherData.temp) + " °F and " + weatherData.description +
        "<br><br>Chance of precipitation is " + weatherData.precipChance + "</p>";

    if (Math.round(weatherData.temp) !== Math.round(weatherData.tempFeel)) {
        document.getElementById("variables").innerHTML =
            "<p>It feels like it is " + Math.round(weatherData.tempFeel) + " °F.</p>";
    }
}
