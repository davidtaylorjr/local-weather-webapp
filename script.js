
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

    $.getJSON('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&key=AIzaSyAZch_gAq-6Ja3fUQ8sXStIhyB_dJ0mSgU', function (city) {

      var address = city.results[2].formatted_address;


      var streetAddress = document.getElementById(userAddress);

      userAddress.innerHTML = "<p>Current condtions for " + address;

    });


$.ajax({
  url: 'https://api.darksky.net/forecast/61f104c5d563f5c8aa29eca3beea2bde/' + latitude + ',' + longitude,
  dataType: "jsonp",
  success: function(data) {
    console.log(data);
  }
});

}

  function error() {
    output.innerHTML = "Unable to retrieve your location";
  }

  output.innerHTML = "<p>Locating…</p>";

  navigator.geolocation.getCurrentPosition(success, error);

}
