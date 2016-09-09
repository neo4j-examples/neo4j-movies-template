import {call, put, take} from "redux-saga/effects";
import {takeEvery} from "redux-saga";
import {push} from "react-router-redux";
import ProfileApi from "../../api/ProfileApi";
import * as Actions from "../actions/ProfileActions";
import * as Types from "../actions/ProfileActionTypes";

export default function* profileFlow() {

  yield [
    takeEvery(Types.PROFILE_GET, getProfile),
  ]
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
