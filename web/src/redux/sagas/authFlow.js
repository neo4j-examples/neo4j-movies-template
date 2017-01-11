import {call, put} from 'redux-saga/effects';
import {takeEvery} from 'redux-saga';
import AuthApi from '../../api/AuthApi';
import * as Actions from '../actions/AuthActions';
import * as ProfileActions from '../actions/ProfileActions';
import * as Types from '../actions/AuthActionTypes';
import UserSession from '../../UserSession';

export default function* authFlow() {

  yield [
    takeEvery(Types.LOGIN, login),
    takeEvery(Types.LOGOUT, logout)
  ];
}

function* login(action) {
  var {username, password} = action;
  try {
    const response = yield call(AuthApi.login, username, password);
    UserSession.setToken(response.token);

    yield put(Actions.loginSuccess(response.token));
    yield put(ProfileActions.getProfile());
  }
  catch (error) {
    yield put(Actions.loginFailure(error));
  }
}

function* logout() {
  UserSession.setToken(null);
}