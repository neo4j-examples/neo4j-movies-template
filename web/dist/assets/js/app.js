'use strict';

/* App Module */

var contentApp = angular.module('contentApp', [
  'ngRoute',
  'contentappControllers'
]);

contentApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/movies', {
        templateUrl: 'assets/partials/home.html',
        controller: 'MovieListCtrl'
      }).
      when('/movies/:movieId', {
        templateUrl: 'assets/partials/movie-detail.html',
        controller: 'MovieItemCtrl'
      }).
      when('/people/:peopleId', {
        templateUrl: 'assets/partials/people-detail.html',
        controller: 'PeopleItemCtrl'
      }).
      otherwise({
        redirectTo: '/movies'
      });
  }]);



