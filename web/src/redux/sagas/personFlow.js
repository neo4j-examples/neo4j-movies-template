import {all, call, put, takeEvery} from 'redux-saga/effects';
import PersonApi from '../../api/PersonApi';
import * as Actions from '../actions/PersonActions';
import * as Types from '../actions/PersonActionTypes';

export default function* movieFlow() {
  yield all([
    takeEvery(Types.PERSON_DETAIL_GET_REQUEST, getPerson),
    takeEvery(Types.PERSON_RELATED_GET_REQUEST, getRelated)
  ]);
}

function* getPerson(action) {
  var {id} = action;
  try {
    const response = yield call(PersonApi.getPerson, id);
    yield put(Actions.getPersonSuccess(response));
  }
  catch (error) {
    yield put(Actions.getPersonFailure(error));
  }
}

function* getRelated(action) {
  var {id} = action;
  try {
    const response = yield call(PersonApi.getRelated, id);
    yield put(Actions.getRelatedSuccess(response));
  }
  catch (error) {
    yield put(Actions.getRelatedFailure(error));
  }
}
