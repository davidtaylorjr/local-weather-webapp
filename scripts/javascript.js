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
        $.getJSON('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&key=AIzaSyAZch_gAq-6Ja3fUQ8sXStIhyB_dJ0mSgU', function(city) {

            var address = city.results[2].formatted_address;


            var userAddressObj = document.getElementById(userAddress);

            userAddress.innerHTML = "<p>Current condtions for " + address;

        });

        //current conditions api from Darksky.net and variables for printing inside app.

        $.ajax({
            url: 'https://api.darksky.net/forecast/61f104c5d563f5c8aa29eca3beea2bde/' + latitude + ',' + longitude + "?units=us",
            dataType: "jsonp",
            success: function(data) {


                var temp = data.currently.temperature;
                var description = data.currently.summary;
                var hourlyDescription = data.hourly.summary;
                var celsius = Math.round((temp - 32) * (5 / 9));
                var tempFeel = data.currently.apparentTemperature;
                var tempFeelCelsius = Math.round((tempFeel - 32) * (5 / 9));
                var forecast = data.daily.summary;

                if (data.hasOwnProperty("alerts")) {
                    var severe = data.alerts;
                    var severeAlert = data.alerts.title;
                        window.severe = severe;
                        alert(severeAlert);
                    }


                window.temp = temp;
                window.description = description;
                window.celsius = celsius;
                window.tempFeel = tempFeel;
                window.tempFeelCelsius = tempFeelCelsius;


                console.log(data);

                var current = document.getElementById(conditions);
                var dataPoints = document.getElementById(variables);

                conditions.innerHTML = "<p>It is currently " + Math.round(temp) + " °F" + " and " + description;

                if (temp != tempFeel) {
                    variables.innerHTML = "<p> It feels like it is " + Math.round(tempFeel) + " °F.";

                }



                var hourly = document.getElementById(twentyfour);

                twentyfour.innerHTML = "<p> Expect " + hourlyDescription;

                var weatherIcon = document.getElementById(weathercon);

                // switch to generate weather icon based on current conditions
                var icon = data.currently.icon;

                switch (icon) {
                    case 'clear-night':
                    case 'clear-day':
                        return weathercon.innerHTML = '<div class="sun"><div class=rays></div></div>';

                    case 'rain':
                        return weathercon.innerHTML = '<div class="cloud"><div class="rain"></div></div>';

                    case 'thunderstorm':
                    case 'hail':
                        return weathercon.innerHTML = '<div class="cloud"><div class ="lightning"><div class="bolt"></div><div class="bolt"></div></div>';

                    case 'cloudy':
                    case 'fog':
                    case 'windy':
                        return weathercon.innerHTML = '<div class="cloud"></div><div class="cloud"></div>';

                    case 'snow':
                    case 'sleet':
                        return weathercon.innerHTML = '<div class="cloud"><div class="snow"><div class="flake"></div><div class="flake"></div></div></div>';

                    case 'partly-cloudy-day':
                    case 'partly-cloudy-night':
                        return weathercon.innerHTML = '<div class="cloud"></div><div class="sun"><div class="rays"></div></div>';

                    case 'tornado':
                        return weathercon.innerHTML = '<div class="cloud"><div class ="lightning"><div class="bolt"></div><div class="bolt"></div></div></div><div class="cloud"></div>';


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

}

// Code to return the celsius converstion
function convertC() {

    conditions.innerHTML = "<p> It is currently " + Math.round(celsius) + " °C" + " and " + description;

    if (temp != tempFeel) {
        variables.innerHTML = "<p> It feels like it is " + Math.round(tempFeelCelsius) + " °C.";

    }

}

function convertF() {

    conditions.innerHTML = "<p> It is currently " + Math.round(temp) + " °F" + " and " + description;

    if (temp != tempFeel) {
        variables.innerHTML = "<p> It feels like it is " + Math.round(tempFeel) + " °F.";

    }

}
