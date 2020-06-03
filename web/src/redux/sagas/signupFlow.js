import {all, call, put, takeEvery} from 'redux-saga/effects';
import AuthApi from '../../api/AuthApi';
import * as Actions from '../actions/ProfileActions';
import * as Types from '../actions/ProfileActionTypes';
import * as AuthActions from '../actions/AuthActions';
import { push } from 'connected-react-router'

export default function* signupFlow() {
  yield all([
    takeEvery(Types.PROFILE_CREATE, createProfile),
  ]);
}

function* createProfile(action) {
  var {payload} = action;

  try {
    const response = yield call(AuthApi.register, payload);
    yield put(Actions.createProfileSuccess(response));
    yield put(AuthActions.login(payload.username, payload.password));
    yield put(push('/signup-status'));
  }
  catch (error) {
    yield put(Actions.createProfileFailure(error));
  }
}

