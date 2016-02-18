import * as Types from './MovieActionTypes';
import MoviesApi from '../../api/MoviesApi';
import {callApi, apiFailure} from './ApiActions';

export function clearMovie() {
  return {
    type: Types.MOVIE_DETAIL_CLEAR
  }
}

export function getGenres() {
  return callApi({
    types: [Types.MOVIE_GENRES_GET_REQUEST, Types.MOVIE_GENRES_GET_SUCCESS],
    callAPI: () => MoviesApi.getGenres()
  });
}

export function getMoviesByGenres(names) {
  return callApi({
    types: [Types.MOVIES_BY_GENRES_GET_REQUEST, Types.MOVIES_BY_GENRES_GET_SUCCESS],
    callAPI: () => MoviesApi.getMoviesByGenres(names)
  });
}

export function getMovie(id) {
  return callApi({
    types: [Types.MOVIE_DETAIL_GET_REQUEST, Types.MOVIE_DETAIL_GET_SUCCESS],
    callAPI: () => MoviesApi.getMovie(id)
  });
}

export function getFeaturedMovies() {
  return callApi({
    types: [Types.MOVIES_FEATURED_GET_REQUEST, Types.MOVIES_FEATURED_GET_SUCCESS],
    callAPI: () => MoviesApi.getFeaturedMovies()
  });
}


