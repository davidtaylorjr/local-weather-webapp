//Function to find geolocation coordinates

function geoLocation() {

var output = document.getElementById("out");

  if (!navigator.geolocation){
    output.innerHTML = '<p>Location services are not supported by your browser</p>';
    return;
  }

  function success(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    output.innerHTML = '<p>Latitude is ' + latitude + '° <br>Longitude is ' + longitude + '°</p>';

  }

  function error() {
    output.innerHTML = "Unable to retrieve your location";
  }

  output.innerHTML = "<p>Locating…</p>";

  navigator.geolocation.getCurrentPosition(success, error);
}
