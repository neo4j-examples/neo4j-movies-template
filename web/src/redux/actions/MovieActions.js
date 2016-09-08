import * as Types from "./MovieActionTypes";

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



