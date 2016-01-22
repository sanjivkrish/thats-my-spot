'use strict';

var app = angular.module('assignment8App');

//Controller to handle the venue module
app.controller('MainController', function ($scope, $http, $anchorScroll, $location) {
    $scope.trip = {};

    //Passing Latitude, longitude and Zoom value as an argument to get that location
    $scope.trip.initializeMap = function (lat, lng, zoomValue) {
        var myCenter = new google.maps.LatLng(lat, lng);
        var mapProp = {
            center: myCenter,
            zoom: zoomValue,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map-canvas"), mapProp);
        var marker = new google.maps.Marker({
            position: myCenter
        });
        marker.setMap(map);
    };

    //This function is triggered when user searches for the location
    $scope.trip.search = function () {
        $http.get('https://api.foursquare.com/v2/venues/explore?near=' + $scope.trip.searchplace + '&oauth_token=2NTXCBLHM4A1P52VKVXYXQLFVSGMPGVLHGDZL4PTPNWZI2IR&v=20150528')
            .success(function (data) {
                //data contains the JSON object returned by foursquare
                $scope.trip.initializeMap(data.response.geocode.center.lat, data.response.geocode.center.lng, 15);
                $scope.trip.places = data.response.groups[0].items;
            })
            .error(function (data) {
                $scope.trip.places = false;
                $scope.trip.errorReport = "No results found";
            });
    };
});
