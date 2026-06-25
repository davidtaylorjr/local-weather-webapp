var weatherData = {
    temp: null,
    celsius: null,
    tempFeel: null,
    tempFeelCelsius: null,
    description: null,
    precipChance: null,
    humidity: null,
    windSpeed: null,
    todayHiF: null,
    todayLoF: null,
    todayHiC: null,
    todayLoC: null,
    iconClass: null,
    forecastDays: []
};

var currentUnit = 'F';

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

function toC(f) { return Math.round((f - 32) * 5 / 9); }

function buildForecastStrip(unit) {
    var html = '';
    for (var i = 0; i < weatherData.forecastDays.length; i++) {
        var day = weatherData.forecastDays[i];
        var hi = unit === 'C' ? day.hiC : day.hiF;
        var lo = unit === 'C' ? day.loC : day.loF;
        var deg = unit === 'C' ? '°C' : '°F';
        html += '<div class="forecast-day">' +
            '<div class="day-name">' + day.dayName + '</div>' +
            '<i class="wi ' + day.iconClass + '"></i>' +
            '<div class="hi-lo"><span class="hi">' + hi + deg + '</span><br>' + lo + deg + '</div>' +
            '</div>';
    }
    document.getElementById('forecast-strip').innerHTML = html;
}

function renderWeather(unit) {
    var temp = unit === 'C' ? weatherData.celsius : Math.round(weatherData.temp);
    var tempFeel = unit === 'C' ? weatherData.tempFeelCelsius : Math.round(weatherData.tempFeel);
    var hi = unit === 'C' ? weatherData.todayHiC : weatherData.todayHiF;
    var lo = unit === 'C' ? weatherData.todayLoC : weatherData.todayLoF;
    var deg = unit === 'C' ? '°C' : '°F';

    document.getElementById('hero-temp').textContent = temp + deg;
    document.getElementById('hero-hi-lo').textContent = 'H: ' + hi + deg + '  /  L: ' + lo + deg;
    document.getElementById('detail-feels').textContent = tempFeel + deg;

    buildForecastStrip(unit);
}

function showApp() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('app').style.display = '';
}

function setUnit(unit) {
    currentUnit = unit;
    document.getElementById('fahrenheitbtn').classList.toggle('active', unit === 'F');
    document.getElementById('celsiusbtn').classList.toggle('active', unit === 'C');
    renderWeather(unit);
}

function convertF() { setUnit('F'); }
function convertC() { setUnit('C'); }

function geoLocation() { useGPS(); }

function useGPS() {
    if (!navigator.geolocation) {
        showApp();
        document.getElementById('out').innerHTML = '<p>Geolocation is not supported by your browser.</p>';
        return;
    }
    document.getElementById('loading').style.display = '';
    document.getElementById('app').style.display = 'none';

    navigator.geolocation.getCurrentPosition(function(position) {
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;

        // Reverse geocode for display name
        $.ajax({
            url: 'https://nominatim.openstreetmap.org/reverse',
            data: { lat: lat, lon: lon, format: 'json' },
            dataType: 'json',
            timeout: 8000,
            success: function(geo) {
                var locationName;
                try {
                    var addr = (geo && geo.address) ? geo.address : {};
                    var city = addr.city || addr.town || addr.village || addr.county;
                    var region = addr.state ? ', ' + addr.state : '';
                    locationName = city ? (city + region) : (geo.display_name || (lat.toFixed(4) + ', ' + lon.toFixed(4)));
                } catch(e) {
                    locationName = lat.toFixed(4) + ', ' + lon.toFixed(4);
                }
                fetchWeather(lat, lon, locationName);
            },
            error: function() {
                fetchWeather(lat, lon, lat.toFixed(4) + ', ' + lon.toFixed(4));
            }
        });
    }, function() {
        showApp();
        document.getElementById('out').innerHTML = '<p>Unable to retrieve your location. Please allow location access and refresh.</p>';
    });
}

function searchLocation() {
    var query = document.getElementById('location-input').value.trim();
    if (!query) return;

    document.getElementById('location-input').blur();
    document.getElementById('loading').style.display = '';
    document.getElementById('app').style.display = 'none';

    fetch('https://nominatim.openstreetmap.org/search?q=' + encodeURIComponent(query) + '&format=json&limit=1')
        .then(function(r) { return r.json(); })
        .then(function(results) {
            if (!results || results.length === 0) {
                showApp();
                document.getElementById('out').innerHTML = '<p>Location not found. Try a different search.</p>';
                return;
            }
            var r = results[0];
            fetchWeather(parseFloat(r.lat), parseFloat(r.lon), r.display_name.split(',').slice(0, 2).join(',').trim());
        })
        .catch(function() {
            showApp();
            document.getElementById('out').innerHTML = '<p>Search failed. Please try again.</p>';
        });
}

function fetchWeather(lat, lon, locationName) {
    var apiUrl = 'https://api.open-meteo.com/v1/forecast' +
        '?latitude=' + lat +
        '&longitude=' + lon +
        '&current=temperature_2m,apparent_temperature,precipitation_probability,weather_code,is_day,relative_humidity_2m,wind_speed_10m' +
        '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max' +
        '&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto&forecast_days=7';

    fetch(apiUrl)
        .then(function(r) {
            if (!r.ok) throw new Error('HTTP ' + r.status);
            return r.json();
        })
        .then(function(data) {
            var current = data.current;
            var daily = data.daily;

            var temp = current.temperature_2m;
            var tempFeel = current.apparent_temperature;
            var weatherCode = current.weather_code;
            var isDay = current.is_day === 1;

            weatherData.temp = temp;
            weatherData.celsius = toC(temp);
            weatherData.tempFeel = tempFeel;
            weatherData.tempFeelCelsius = toC(tempFeel);
            weatherData.description = getWeatherDescription(weatherCode, isDay);
            weatherData.precipChance = current.precipitation_probability + '%';
            weatherData.humidity = current.relative_humidity_2m + '%';
            weatherData.windSpeed = Math.round(current.wind_speed_10m) + ' mph';
            weatherData.iconClass = getWeatherIcon(weatherCode, isDay);

            var hiF = Math.round(daily.temperature_2m_max[0]);
            var loF = Math.round(daily.temperature_2m_min[0]);
            weatherData.todayHiF = hiF;
            weatherData.todayLoF = loF;
            weatherData.todayHiC = toC(hiF);
            weatherData.todayLoC = toC(loF);

            var dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            weatherData.forecastDays = [];
            for (var i = 1; i < daily.time.length; i++) {
                var d = new Date(daily.time[i] + 'T12:00:00');
                var dHiF = Math.round(daily.temperature_2m_max[i]);
                var dLoF = Math.round(daily.temperature_2m_min[i]);
                weatherData.forecastDays.push({
                    dayName: dayNames[d.getDay()],
                    iconClass: getWeatherIcon(daily.weather_code[i], true),
                    hiF: dHiF,
                    loF: dLoF,
                    hiC: toC(dHiF),
                    loC: toC(dLoF)
                });
            }

            // Populate static/non-unit elements
            document.getElementById('userAddress').innerHTML = '<p>' + (locationName || '') + '</p>';
            document.getElementById('weathercon').innerHTML = '<i class="wi ' + weatherData.iconClass + '"></i>';
            document.getElementById('description').textContent = weatherData.description;
            document.getElementById('detail-precip').textContent = weatherData.precipChance;
            document.getElementById('detail-humidity').textContent = weatherData.humidity;
            document.getElementById('detail-wind').textContent = weatherData.windSpeed;
            document.getElementById('out').innerHTML = '';

            var todayCode = daily.weather_code[0];
            document.getElementById('today-summary').innerHTML =
                '<p>Expect ' + getWeatherDescription(todayCode, true).toLowerCase() + ' conditions throughout today.</p>';

            // Render unit-dependent values
            renderWeather(currentUnit);
            showApp();
        })
        .catch(function(err) {
            showApp();
            document.getElementById('out').innerHTML = '<p>Unable to load weather data. Please try again.</p>';
        });
}

// Allow pressing Enter in the search input
document.addEventListener('DOMContentLoaded', function() {
    var input = document.getElementById('location-input');
    if (input) {
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') searchLocation();
        });
    }
});
