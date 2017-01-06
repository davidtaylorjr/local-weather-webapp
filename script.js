
//Geolocation Function is listed below.

function geoLocation() {
    var output = document.getElementById("out");

    $.getJSON('https://ipinfo.io/geo', function(response) {
        var loc = response.loc.split(',');
        var coords = {
            latitude: loc[0],
            longitude: loc[1]
        };
        var city = response.city;
        var state = response.region;
        var postal = response.postal;
        var country = response.country;

        output.innerHTML = "<p>Here is the weather for " + city + ", " + state;
    });

    $.getJSON('https://api.openweathermap.org/data/2.5/weather?zip=' + postal + ',' + country + "&appid=ec96c6ed7e722bdd15cfebffbff509a6", function(conditions) {

        var main = response.main.split(',');
        var conditons = {
            temp: main[0]
        };

        console.log(temp);
        var weatherConditions = document.getElementById("conditions");

        conditions.innerHTML = "<p>The current temperature is " + temp;
    });
}
