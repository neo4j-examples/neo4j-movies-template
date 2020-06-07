import {all, call, put, takeEvery} from 'redux-saga/effects';
import ProfileApi from '../../api/ProfileApi';
import MoviesApi from '../../api/MoviesApi';
import * as Actions from '../actions/ProfileActions';
import * as Types from '../actions/ProfileActionTypes';

export default function* profileFlow() {
  yield all([
    takeEvery(Types.PROFILE_GET, getProfile),
    takeEvery(Types.PROFILE_GET_RATINGS, getProfileRatings),
    takeEvery(Types.PROFILE_MOVIE_RATE, profileRateMovie),
    takeEvery(Types.PROFILE_MOVIE_DELETE_RATING, profileDeleteRating),
    takeEvery(Types.PROFILE_GET_RECOMMENDATIONS, getProfileRecommendations)
  ]);
}

function* getProfile() {
  try {
    const response = yield call(ProfileApi.getProfile);
    yield put(Actions.getProfileSuccess(response));
  }
  catch (error) {
    yield put(Actions.getProfileFailure(error));
  }
}

function* getProfileRatings() {
  try {
    const response = yield call(ProfileApi.getProfileRatings);
    yield put(Actions.getProfileRatingsSuccess(response));
  }
  catch (error) {
    yield put(Actions.getProfileRatingsFailure(error));
  }
}

function* profileRateMovie(action) {
  var {id, rating} = action;
  try {
    const response = yield call(MoviesApi.rateMovie, id, rating);
    yield put(Actions.profileRateMovieSuccess(response));
    yield put(Actions.getProfileRatings());
  }
  catch (error) {
    yield put(Actions.profileRateMovieFailure(error));
  }
}

function* profileDeleteRating(action) {
  var {id} = action;
  try {
    const response = yield call(MoviesApi.deleteRating, id);
    yield put(Actions.profileDeleteMovieRatingSuccess(response));
    yield put(Actions.getProfileRatings());
  }
  catch (error) {
    yield put(Actions.profileDeleteMovieRatingFailure(error));
  }
}

function* getProfileRecommendations() {
  try {
    const response = yield call(ProfileApi.getProfileRecommendations);
    yield put(Actions.getProfileRecommendationsSuccess(response));
  }
  catch (error) {
    yield put(Actions.getProfileRecommendationsFailure(error));
  }
}
