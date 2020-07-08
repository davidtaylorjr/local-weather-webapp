
  
  function success(pos) {
    var crd = pos.coords;
    var lat = pos.coords.latitude;
    var lon = pos.coords.longitude;
  
    console.log('Your current position is:');
    console.log(`Latitude : ${lat}`);
    console.log(`Longitude: ${lon}`);
    console.log(`More or less ${crd.accuracy} meters.`);
    console.log(`Latitude: ${lat}`);
    console.log(crd);

    $.ajax({
        url: 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=ec96c6ed7e722bdd15cfebffbff509a6',

        datatype: "jsonp",
        success: function(data) {
            
            var timezone = data.timezone;
            var temperature = data.current.temp;
            console.log(temperature)
        }
    }

    )

  }
  
  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }
  
  navigator.geolocation.getCurrentPosition(success, error);
  
