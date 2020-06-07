import {all, fork} from 'redux-saga/effects';
import errorFlow from './errorFlow';
import authFlow from './authFlow';
import profileFlow from './profileFlow';
import signupFlow from './signupFlow';
import movieFlow from './movieFlow';
import personFlow from './personFlow';

export default function* root() {
  yield all([
    fork(errorFlow),
    fork(authFlow),
    fork(profileFlow),
    fork(signupFlow),
    fork(movieFlow),
    fork(personFlow)
  ]);
}
