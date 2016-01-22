'use strict';

var app = angular.module('assignment8App');

//Factory containing the object to store the datas that are selected by user
app.factory('selectedVenue', function () {
    return {
        venuename : [],
        venueDetails : []
    };
});

//Controller to handle the venue module
app.controller('MainController', function ($scope, $http, $anchorScroll, $location, selectedVenue) {
    $scope.trip = {};
    $scope.trip.pdfStatus = true;

    //Function to route the page to initial state
    $scope.trip.redirectHome = function () {
        $location.path('home');
    }

    //Function to scroll up
    $(document).ready(function () {

        //Check to see if the window is top if not then display button
        $(window).scroll(function () {
            if ($(this).scrollTop() > 100) {
                $('.scrollToTop').fadeIn();
            } else {
                $('.scrollToTop').fadeOut();
            }
        });

        //Click event to scroll to top
        $('.scrollToTop').click(function () {
            $('html, body').animate({scrollTop : 0}, 800);
            return false;
        });

    });

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

    $scope.trip.goToMap = function () {
        // call $anchorScroll()
        $anchorScroll();
    };

    //Changing the button "ADD" in the container
    $scope.trip.toggle = function (obj) {
        var i, status = true;
        for (i in selectedVenue.venuename) {
            if (selectedVenue.venuename[i] === obj.name) {
                selectedVenue.venuename.splice(0, 1);
                selectedVenue.venueDetails.splice(0, 1);
                status = false;
            }
        }
        if (status === true) {
            selectedVenue.venuename.push(obj.name);
            selectedVenue.venueDetails.push(obj);
        }
    };
});
