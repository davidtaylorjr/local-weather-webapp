
//Geolocation Function is listed below.

function geoLocation() {
    var output = document.getElementById("out");

    if (!navigator.geolocation){
    output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
    return;
  }

  function success(position) {
    var latitude  = position.coords.latitude;
    var longitude = position.coords.longitude;

    output.innerHTML = '<p>Latitude is ' + latitude + '° <br>Longitude is ' + longitude + '°</p>';

  /*  var img = new Image();
    img.src = "https://maps.googleapis.com/maps/api/staticmap?center=" + latitude + "," + longitude + "&zoom=13&size=300x300&sensor=false";

    output.appendChild(img);*/
  }

  function error() {
    output.innerHTML = "Unable to retrieve your location";
  }

  output.innerHTML = "<p>Locating…</p>";

  navigator.geolocation.getCurrentPosition(success, error);


        $.getJSON('http://api.openweathermap.org/data/2.5/weather?zip=' + zip + ',' + country + "&units=imperial" + "&appid=ec96c6ed7e722bdd15cfebffbff509a6", function(data) {

            //var main = data.main.split(',');
            var temp = data.main.temp;

            console.log(temp);
            var weatherConditions = document.getElementById("conditions");

            conditions.innerHTML = "<p>The current temperature is " + temp;
        });

}
