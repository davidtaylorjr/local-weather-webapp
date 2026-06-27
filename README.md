# Your Local Weather

An Open-Source Web Application by David Taylor, Jr.

## Description

**Your Local Weather** is a static web application that uses your browser's geolocation (or a city search) to display current weather conditions, an hourly forecast, a 10-day extended forecast, and a live radar map — all with no account or API key required.

Weather data is provided by [Open-Meteo](https://open-meteo.com/), an open-source weather API. Location lookup uses [Nominatim](https://nominatim.org/) (OpenStreetMap). Radar is powered by [RainViewer](https://www.rainviewer.com/).

## Features

- **Current conditions** — temperature, feels like, precipitation chance, humidity, and wind speed
- **Hero display** — large weather icon, condition description, and today's high/low
- **Hourly forecast** — next 24 hours in a scrollable strip with icon, temperature, and precip %
- **10-Day forecast** — extended daily forecast in a scrollable strip; toggle between Hourly and 10-Day views
- **Temperature toggle** — switch between °F and °C; all values update instantly without re-fetching
- **Location search** — type any city name to get weather for that location
- **GPS location** — uses browser geolocation to show weather for your current position
- **Live radar map** — interactive Leaflet map with RainViewer radar overlay (tap Show Radar to open)

## Dependencies

All dependencies are free to use with no API key required.

| Library / API | Purpose | License / Cost |
|--------------|---------|---------------|
| [Open-Meteo](https://open-meteo.com/) | Weather data (current, hourly, 10-day forecast) | Free, no key |
| [Nominatim (OpenStreetMap)](https://nominatim.org/) | Reverse geocoding (GPS → city name) and city search | Free, no key |
| [RainViewer](https://www.rainviewer.com/api.html) | Radar tile overlay | Free, no key |
| [Leaflet.js 1.9.4](https://leafletjs.com/) | Interactive radar map | Open source (BSD-2) |
| [jQuery 3.7.1](https://jquery.com/) | AJAX for geocoding requests | Open source (MIT) |
| Weather Icons | Font-based weather icon set | Included in repo |

Leaflet and jQuery are loaded from CDN at runtime. No npm or build step is required.

## How To Use

**No API keys required.** Clone or download the repository and open `index.html` directly in a browser, or host the files on any static web server (e.g. GitHub Pages).

```bash
git clone https://github.com/davidtaylorjr/local-weather-webapp.git
cd local-weather-webapp
open index.html   # or serve with any static file server
```

- **GPS weather** — allow location access when prompted; the app loads your local weather automatically
- **City search** — type a city name in the search bar and press Enter or tap the search button
- **Radar** — tap "Show Radar" to expand the interactive radar map below the forecast strip
- **Units** — tap °F or °C in the header to switch temperature units

The app is mobile-first and tested on iOS Safari. Location permission is required for GPS; the search bar works without it.

## Contributing

Currently we are not accepting new contributions to the project directly. However, feel free to clone and modify the code however you like.  If you see something that is broken, or could be done better, feel free to submit a pull request for review.

Anything else can be posted to the [Issues](https://github.com/davidtaylorjr/local-weather-webapp/issues) area for review.
