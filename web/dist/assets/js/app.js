'use strict';

/* App Module */
var PATH_TO_API = 'http://movieapi-neo4j.herokuapp.com/api/v0/';
//var PATH_TO_API = 'http://localhost:3000/docs/'

var contentApp = angular.module('contentApp', [
  'ngRoute',
  'contentappControllers'
]);

/*TODO CRISTINA
- before I start this should be using environemt variable so I can refer to my local node API more easily. 
- add Genre here - 
- add partialsgenre-detail.html
- add controller GenreItemCtrl

*/




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



