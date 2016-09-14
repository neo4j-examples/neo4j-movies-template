import * as Types from './ProfileActionTypes';

export function getProfile() {
  return {type: Types.PROFILE_GET};
}

export function getProfileSuccess(payload) {
  return {type: Types.PROFILE_GET_SUCCESS, payload};
}

export function getProfileFailure(error) {
  return {type: Types.PROFILE_GET_FAILURE, error};
}

export function createProfile(payload) {
  return {type: Types.PROFILE_CREATE, payload};
}

export function createProfileSuccess(payload) {
  return {type: Types.PROFILE_CREATE_SUCCESS, payload};
}

export function createProfileFailure(error) {
  return {type: Types.PROFILE_CREATE_FAILURE, error};
}

export function createProfileInit() {
  return {type: Types.PROFILE_CREATE_INIT};
}

export function getProfileRatings() {
  return {type: Types.PROFILE_GET_RATINGS};
}

export function getProfileRatingsSuccess(payload) {
  return {type: Types.PROFILE_GET_RATINGS_SUCCESS, payload};
}

export function getProfileRatingsFailure() {
  return {type: Types.PROFILE_GET_RATINGS_FAILURE};
}

export function profileRateMovie(id, rating) {
  return {type: Types.PROFILE_MOVIE_RATE, id, rating};
}

export function profileRateMovieSuccess() {
  return {type: Types.PROFILE_MOVIE_RATE_SUCCESS};
}

export function profileRateMovieFailure() {
  return {type: Types.PROFILE_MOVIE_RATE_FAILURE};
}

export function profileDeleteMovieRating(id) {
  return {type: Types.PROFILE_MOVIE_DELETE_RATING, id};
}

export function profileDeleteMovieRatingSuccess() {
  return {type: Types.PROFILE_MOVIE_DELETE_RATING_SUCCESS};
}

export function profileDeleteMovieRatingFailure() {
  return {type: Types.PROFILE_MOVIE_DELETE_RATING_FAILURE};
}

export function getProfileRecommendations(id) {
  return {type: Types.PROFILE_GET_RECOMMENDATIONS, id};
}

export function getProfileRecommendationsSuccess(payload) {
  return {type: Types.PROFILE_GET_RECOMMENDATIONS_SUCCESS, payload};
}

export function getProfileRecommendationsFailure() {
  return {type: Types.PROFILE_GET_RECOMMENDATIONS_FAILURE};
}
