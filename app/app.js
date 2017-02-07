var app = angular.module('localWeather', []);


var MainController = function($scope, $http) {

    var onAddressComplete = function(address) {
        $scope.userAddress = address.data;

    };

    function success(pos) {
        var crd = pos.coords;
        $scope.coords = crd;



        $http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + crd.latitude + ',' + crd.longitude + '&key=AIzaSyAZch_gAq-6Ja3fUQ8sXStIhyB_dJ0mSgU')
            .then(onAddressComplete);


        $.ajax({
            url: 'https://api.darksky.net/forecast/61f104c5d563f5c8aa29eca3beea2bde/' + crd.latitude + ',' + crd.longitude + "?units=us",
            dataType: "jsonp",
            success: function(data) {
                $scope.weather = data;
                console.log($scope.weather);
            }
        });

    }


    navigator.geolocation.getCurrentPosition(success);
};


app.controller('MainController', MainController);