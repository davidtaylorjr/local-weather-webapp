(function() {

    var location = function(zip) {

        var options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

        function success(pos) {
            var crd = pos.coords;

            $.getJSON('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + crd.latitude + ',' + crd.longitude + '&key=AIzaSyAZch_gAq-6Ja3fUQ8sXStIhyB_dJ0mSgU', function(city) {

                var address = city.results[1].formatted_address;
                var zip = city.results[2].address_components[0].short_name;

            });
        };

        function error(err) {
            console.warn(`ERROR(${err.code}): ${err.message}`);
        };

        navigator.geolocation.getCurrentPosition(success, error, options);
    };

    var module = angular.module('localWeather');
    module.factory('zip', zip);

}());