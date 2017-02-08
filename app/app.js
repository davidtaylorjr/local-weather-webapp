var app = angular.module('localWeather', ['ngRoute']);

app.config(function($routeProvider) {


    $routeProvider
        .when("/", {
            templateUrl: "index.html",
            controller: "MainController"
        });
});