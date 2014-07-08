'use strict';

/* Controllers */

angular.module('SharedServices', [])
    .config(function ($httpProvider) {
        $httpProvider.responseInterceptors.push('myHttpInterceptor');
        var spinnerFunction = function (data, headersGetter) {
            // todo start the spinner here
            //alert('start spinner');
            $('#mydiv').show();
            return data;
        };
        $httpProvider.defaults.transformRequest.push(spinnerFunction);
    })
// register the interceptor as a service, intercepts ALL angular ajax http calls
    .factory('myHttpInterceptor', function ($q, $window) {
        return function (promise) {
            return promise.then(function (response) {
                // do something on success
                // todo hide the spinner
                //alert('stop spinner');
                $('#mydiv').hide();
                $('.hidden-content').removeClass('hidden-content');
                return response;

            }, function (response) {
                // do something on error
                // todo hide the spinner
                //alert('stop spinner');
                $('#mydiv').hide();
                $('.hidden-content').removeClass('hidden-content');
                return $q.reject(response);
            });
        };
    });

var contentappControllers = angular.module('contentappControllers', ['SharedServices']);

contentApp.directive('carousel', function() {
	var res = {
     restrict : 'A',
     link     : function (scope, element, attrs) {
           scope.$watch(attrs.carousel, function(movies) {  
           	if(scope.movies.length > 0)
           	{
           		movies = scope.movies;
           		var genre = element.attr('data-genre');
           		var html = '';
	            for (var i = 0; i < movies.length; i++) {
	            	if ($.inArray(genre, movies[i].genres) != -1) {
	            	var movieTitleLink = movies[i].poster_image || '/assets/img/posters/' + movies[i].title.replace('/', ' ') + '.jpg';
	                 html += '<div class="item">' +
						          '<div class="thumbnail carousel-movies">' +
						            '<a href="index.html#/movies/' + movies[i].title.replace('/', '%252F') + '"><img alt="100%x180" src="' + movieTitleLink + '"></a>' +
						          '</div>' +
						          '<span><a href="index.html#/movies/' + movies[i].title.replace('/', '%252F') + '">' + movies[i].title + '</a></span>' +
						        '</div>';
						    };
	            }
            
            	element[0].innerHTML = html;

            	setTimeout(function() {
	            $(element).owlCarousel({
						items : 8,
						itemsDesktop : [1199,6],
						itemsDesktopSmall : [980,5],
						itemsTablet: [768,4],
						itemsMobile: [479, 2]
					});

            	$("#owl-example").owlCarousel({
					    items : 3,
					    itemsDesktop : [1199,3],
					    itemsDesktopSmall : [980,3],
					    itemsTablet: [768,2]
					});
	           }, 0);
			}
        	
        });
       }
   };
  return res;
});

contentApp.controller('MovieListCtrl', ['$scope', '$http', '$templateCache', 
	function($scope, $http, $templateCache) {
	  	$scope.url = PATH_TO_API +'movies?api_key=special-key&neo4j=false';
	  	$scope.movies = [];

	  	var fetchMovies = function()
	  	{
	  		$http({method: 'GET', url: $scope.url, cache: $templateCache}).
			    success(function(data, status, headers, config) {
			    	$scope.movies = data;
			    }).
			    error(function(data, status, headers, config) {
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
			    });
	  	}

	  	fetchMovies();
	}]);


contentApp.directive('carouselactors', function() {
	var res = {
     restrict : 'A',
     link     : function (scope, element, attrs) {
           scope.$watch(attrs.carouselactors, function(movie) {  
           	if(scope.movie != undefined ? scope.movie.actors != undefined ? scope.movie.actors.length > 0 : false : false)
           	{
           		movie = scope.movie;
           		var html = '';
	            for (var i = 0; i < movie.actors.length; i++) {
					var actorTitleLink = movie.actors[i].poster_image || '/assets/img/actors/' + movie.actors[i].name.replace('/', ' ') + '.jpg';
	                 html += '<div class="item">' +
						          '<div class="thumbnail">' +
						            '<a href="index.html#/people/' + movie.actors[i].name + '"><img src="' + actorTitleLink + '"/></a>' +
						          '</div>' +
						          '<span><a href="index.html#/people/' + movie.actors[i].name + '">' + movie.actors[i].name + '</a></span>' +
						        '</div>';

	            }
            //src="assets/img/actors/' + actorTitleLink + '.jpg"
            	element[0].innerHTML = html;

            	setTimeout(function() {
	            $(element).owlCarousel({
					items : 7,
					itemsDesktop : [1199,6],
					itemsDesktopSmall : [980,5],
					itemsTablet: [768,5],
					itemsMobile: [479, 3]
				});
				Holder.run();
	           }, 0);
			}
        	
        });
       }
   };
  return res;
});

contentApp.directive('carouselrelatedmovies', function() {
	var res = {
     restrict : 'A',
     link     : function (scope, element, attrs) {
           scope.$watch(attrs.carouselrelatedmovies, function(movie) {  
           	if(scope.movie != undefined ? scope.movie.related != undefined ? scope.movie.related.length > 0 : false : false)
           	{
           		movie = scope.movie;
           		var html = '';
	            for (var i = 0; i < movie.related.length; i++) {
					var relatedMovieTitleLink = movie.related[i].related.poster_image || '/assets/img/posters/' + movie.related[i].related.title.replace('/', ' ') + '.jpg';
	                 html += '<div class="item">' +
						          '<div class="thumbnail">' +
						            '<a href="index.html#/movies/' + movie.related[i].related.title.replace('/', '%252F')  + '"><img src="' + relatedMovieTitleLink + '"/></a>' +
						          '</div>' +
						          '<span><a href="index.html#/movies/' + movie.related[i].related.title.replace('/', '%252F')  + '">' + movie.related[i].related.title + '</a></span>' +
						        '</div>';

	            }

            	element[0].innerHTML = html;

            	setTimeout(function() {
	            $(element).owlCarousel({
					items : 7,
					itemsDesktop : [1199,6],
					itemsDesktopSmall : [980,5],
					itemsTablet: [768,5],
					itemsMobile: [479, 3]
				});
				Holder.run();
	           }, 0);
			}
        	
        });
       }
   };
  return res;
});



contentApp.controller('MovieItemCtrl', ['$scope', '$routeParams', '$http', '$templateCache',
  function($scope, $routeParams, $http, $templateCache) {
  		//console.log(PATH_TO_API + 'movies/title/' + encodeURIComponent(decodeURI(decodeURI($routeParams.movieId))) + '?api_key=special-key&neo4j=false');
  		$scope.url = PATH_TO_API + 'movies/title/' + encodeURIComponent(decodeURI(decodeURI($routeParams.movieId))) + '?api_key=special-key&neo4j=false';
	  	var fetchMovie = function()
	  	{
	  		$http({method: 'GET', url: $scope.url, cache: $templateCache}).
			    success(function(data, status, headers, config) {
			    	$scope.movie = data;
			    	$scope.movie.poster_image = $scope.movie.poster_image || '/assets/img/posters/' + $scope.movie.title.replace('/', ' ') + '.jpg';
			    	$scope.movie.poster_image = $scope.movie.poster_image.replace("w185", "w300");
			    }).
			    error(function(data, status, headers, config) {
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
			    });
	  	}

	  	fetchMovie();
  }]);

contentApp.directive('carouselpeoplemovies', function() {
	var res = {
     restrict : 'A',
     link     : function (scope, element, attrs) {
           scope.$watch(attrs.carouselpeoplemovies, function(people) {  
           	//console.log(scope.people);
           	if(scope.people != undefined ? scope.people.movies != undefined ? scope.people.movies.length > 0 : false : false)
           	{
           		people = scope.people;
           		var html = '';
	            for (var i = 0; i < people.movies.length; i++) {
	            	var relatedMovieTitleLink = people.movies[i].poster_image || '/assets/img/posters/' + people.movies[i].title.replace('/', ' ') + '.jpg';
	                 html += '<div class="item">' +
						          '<div class="thumbnail">' +
						            '<a href="index.html#/movies/' + people.movies[i].title.replace('/', '%252F')  + '"><img src="' + relatedMovieTitleLink +'"/></a>' +
						          '</div>' +
						          '<span><a href="index.html#/movies/' + people.movies[i].title.replace('/', '%252F')  + '">' + people.movies[i].title + '</a></span>' +
						        '</div>';

	            }

            	element[0].innerHTML = html;

            	setTimeout(function() {
	            $(element).owlCarousel({
					items : 7,
					itemsDesktop : [1199,6],
					itemsDesktopSmall : [980,5],
					itemsTablet: [768,5],
					itemsMobile: [479, 3]
				});
				Holder.run();
	           }, 0);
			}
        	
        });
       }
   };
  return res;
});

contentApp.directive('carouselrelatedpeople', function() {
	var res = {
     restrict : 'A',
     link     : function (scope, element, attrs) {
           scope.$watch(attrs.carouselrelatedpeople, function(people) {  
           	if(scope.people != undefined ? scope.people.related != undefined ? scope.people.related.length > 0 : false : false)
           	{
           		people = scope.people;
           		var html = '';
	            for (var i = 0; i < people.related.length; i++) {
					var actorTitleLink = people.related[i].related.poster_image || '/assets/img/actors/' + people.related[i].related.name.replace('/', ' ') + '.jpg';
	                 html += '<div class="item">' +
						          '<div class="thumbnail">' +
						            '<a href="index.html#/people/' + people.related[i].related.name + '"><img src="' + actorTitleLink + '"/></a>' +
						          '</div>' +
						          '<span><a href="index.html#/people/' + people.related[i].related.name + '">' + people.related[i].related.name + '</a></span>' +
						        '</div>';

	            }
            //src="assets/img/actors/' + actorTitleLink + '.jpg"
            	element[0].innerHTML = html;

            	setTimeout(function() {
	            $(element).owlCarousel({
					items : 8,
					itemsDesktop : [1199,7],
					itemsDesktopSmall : [980,5],
					itemsTablet: [768,5],
					itemsMobile: [479, 3]
				});
				Holder.run();
	           }, 0);
			}
        	
        });
       }
   };
  return res;
});

contentApp.controller('PeopleItemCtrl', ['$scope', '$routeParams', '$http', '$templateCache',
  function($scope, $routeParams, $http, $templateCache) {
  		$scope.url = PATH_TO_API + 'people/name/' + encodeURIComponent(decodeURI(decodeURI($routeParams.peopleId))) + '?api_key=special-key&neo4j=false';
	  	var fetchPeople = function()
	  	{
	  		$http({method: 'GET', url: $scope.url, cache: $templateCache}).
			    success(function(data, status, headers, config) {
			    	$scope.people = data;
			    	$scope.people.poster_image = $scope.people.poster_image || '/assets/img/actors/' + $scope.people.name.replace('/', ' ') + '.jpg';
			    }).
			    error(function(data, status, headers, config) {
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
			    });
	  	}

	  	fetchPeople();
  }]);
			