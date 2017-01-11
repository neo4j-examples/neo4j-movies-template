import * as Types from './MovieActionTypes';

export function clearMovie() {
  return {type: Types.MOVIE_DETAIL_CLEAR};
}

export function getGenres() {
  return {type: Types.MOVIE_GENRES_GET_REQUEST};
}

export function getGenresSuccess(genres) {
  return {type: Types.MOVIE_GENRES_GET_SUCCESS, genres};
}

export function getGenresFailure(error) {
  return {type: Types.MOVIE_GENRES_GET_FAILURE, error};
}

export function getMoviesByGenres(names) {
  return {type: Types.MOVIES_BY_GENRES_GET_REQUEST, names};
}

export function getMoviesByGenresSuccess(response) {
  return {type: Types.MOVIES_BY_GENRES_GET_SUCCESS, response};
}

export function getMoviesByGenresFailure(error) {
  return {type: Types.MOVIES_BY_GENRES_GET_FAILURE, error};
}

export function getFeaturedMovies() {
  return {type: Types.MOVIES_FEATURED_GET_REQUEST};
}

export function getFeaturedMoviesSuccess(response) {
  return {type: Types.MOVIES_FEATURED_GET_SUCCESS, response};
}

export function getFeaturedMoviesFailure(error) {
  return {type: Types.MOVIES_FEATURED_GET_FAILURE, error};
}

export function getMovie(id) {
  return {type: Types.MOVIE_DETAIL_GET_REQUEST, id};
}

export function getMovieSuccess(response) {
  return {type: Types.MOVIE_DETAIL_GET_SUCCESS, response};
}

export function getMovieFailure(error) {
  return {type: Types.MOVIE_DETAIL_GET_FAILURE, error};
}

export function rateMovie(id, rating) {
  return {type: Types.MOVIE_RATE, id, rating};
}

export function rateMovieSuccess() {
  return {type: Types.MOVIE_RATE_SUCCESS};
}

export function rateMovieFailure() {
  return {type: Types.MOVIE_RATE_FAILURE};
}

export function deleteMovieRating(id) {
  return {type: Types.MOVIE_DELETE_RATING, id};
}

export function deleteMovieRatingSuccess() {
  return {type: Types.MOVIE_DELETE_RATING_SUCCESS};
}

export function deleteMovieRatingFailure() {
  return {type: Types.MOVIE_DELETE_RATING_FAILURE};
}
