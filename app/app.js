(function() {
    var app = angular.module('localWeather', ['ngRoute']);

    app.config(function($routeProvider) {

        $routeProvider
            .when("/main", {
                templateUrl: "app/views/main.html",
                controller: "MainController"
            });
    });


}());