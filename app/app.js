var app = angular.module('localWeather', ['ngRoute']);

app.config(function($routeProvider) {


    $routeProvider
        .when("/", {
            templateUrl: "app/views/main.html",
            controller: ""
        });
});