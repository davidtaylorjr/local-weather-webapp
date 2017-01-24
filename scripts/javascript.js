function geoLocation() {
    var output = document.getElementById("out");

    if (!navigator.geolocation) {
        output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
        return;
    }

    function success(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;



        //Google Maps API to return printed location as opposed to lat/lon coordinates.


        $.getJSON('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&key=YOUR-API-KEY', function(city) {


            var address = city.results[2].formatted_address;


            var userAddressObj = document.getElementById(userAddress);

            userAddress.innerHTML = "<p>Current condtions for " + address;

        });

        //current conditions api from Darksky.net and variables for printing inside app.

        $.ajax({
            url: 'https://api.darksky.net/forecast/YOUR-API-KEY/' + latitude + ',' + longitude + '?units=us',

            dataType: "jsonp",
            success: function(data) {


                var temp = data.currently.temperature;
                var description = data.currently.summary;
                var hourlyDescription = data.hourly.summary;
                var celsius = Math.round((temp - 32) * (5 / 9));
                var tempFeel = data.currently.apparentTemperature;
                var tempFeelCelsius = Math.round((tempFeel - 32) * (5 / 9));
                var extForecast = data.daily.summary;
                var precipChance = (data.currently.precipProbability * 100) + "%";

                if (data.hasOwnProperty("alerts")) {
                    var severe = data.alerts;
                    var severeAlert = data.alerts[0].title;
                    window.severe = severe;
                    alert(severeAlert);
                }




                window.temp = temp;
                window.description = description;
                window.celsius = celsius;
                window.tempFeel = tempFeel;
                window.tempFeelCelsius = tempFeelCelsius;
                window.precipChance = precipChance;


                console.log(data);

                var current = document.getElementById(conditions);
                var dataPoints = document.getElementById(variables);

                conditions.innerHTML = "<p>It is currently " + Math.round(temp) + " °F and " + description + "<br><br> Chance of precipitation is " + precipChance;

                if (temp !== tempFeel) {
                    variables.innerHTML = "<p> It feels like it is " + Math.round(tempFeel) + " °F.";

                }

                var extendedSummary = document.getElementById(extended);

                extended.innerHTML = "<p>Your extended forecast summary is: \"" + extForecast + "\"";



                var hourly = document.getElementById(twentyfour);

                twentyfour.innerHTML = "<p> Expect " + hourlyDescription;

                var weatherIcon = document.getElementById(weathercon);

                // switch to generate weather icon based on current conditions
                var icon = data.currently.icon;

                switch (icon) {
                    case 'clear-night':
                        weathercon.innerHTML = '<i class="wi wi-night-clear"></i>';
                        break;

                    case 'clear-day':
                        weathercon.innerHTML = '<i class="wi wi-day-sunny"></i>';
                        break;

                    case 'rain':
                        weathercon.innerHTML = '<i class="wi wi-showers"></i>';
                        break;

                    case 'thunderstorm':
                        weathercon.innerHTML = '<i class="wi wi-storm-showers"></i>';
                        break;

                    case 'hail':
                        weathercon.innerHTML = '<i class="wi wi-hail"></i>';
                        break;

                    case 'cloudy':
                        weathercon.innerHTML = '<i class="wi wi-cloudy"></i>';
                        break;

                    case 'fog':
                        weathercon.innerHTML = '<i class="wi wi-fog"></i>';
                        break;

                    case 'windy':
                        weathercon.innerHTML = '<i class="wi wi-cloudy-windy"></i>';
                        break;

                    case 'snow':
                        weathercon.innerHTML = '<i class="wi wi-snow"></i>';
                        break;

                    case 'sleet':
                        weathercon.innerHTML = '<i class="wi wi-sleet"></i>';
                        break;

                    case 'partly-cloudy-day':
                        weathercon.innerHTML = '<i class="wi wi-day-cloudy"></i>';
                        break;

                    case 'partly-cloudy-night':
                        weathercon.innerHTML = '<i class="wi wi-night-alt-cloudy"></i>';
                        break;

                    case 'tornado':
                        weathercon.innerHTML = '<i class="wi wi-tornado"></i>';
                        break;


                    default:

                }
            }
        });

    }

    function error() {
        output.innerHTML = "Unable to retrieve your location";
    }

    userAddress.innerHTML = "<p>Grabbing Your Location...</p>";

    navigator.geolocation.getCurrentPosition(success, error);




    // Code to return the celsius converstion
    function convertC() {


        conditions.innerHTML = "<p> It is currently " + Math.round(celsius) + " °C and " + description + "<br><br> Chance of precipitation is " + precipChance;

        if (temp !== tempFeel) {
            variables.innerHTML = "<p> It feels like it is " + Math.round(tempFeelCelsius) + " °C.";


        }
    }

    function convertF() {

        conditions.innerHTML = "<p> It is currently " + Math.round(temp) + " °F" + " and " + description;

        conditions.innerHTML = "<p> It is currently " + Math.round(temp) + " °F and " + description + "<br><br> Chance of precipitation is " + precipChance;

        if (temp !== tempFeel) {
            variables.innerHTML = "<p> It feels like it is " + Math.round(tempFeel) + " °F.";


        }
    }
}