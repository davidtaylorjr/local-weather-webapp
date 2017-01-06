
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

        output.innerHTML = "<p>You are in " + city + ", " + state;
    });

}
