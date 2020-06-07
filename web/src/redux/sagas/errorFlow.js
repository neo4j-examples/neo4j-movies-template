import { takeEvery, put } from 'redux-saga/effects';
import * as NotificationActions from '../actions/NotificationActions';
import _ from 'lodash';

export default function* watchErrors(getState) {
  yield takeEvery('*', function* logger(action) {
    if(action.error) {
      var errorAction = createErrorNotification(action.error);
      yield put(errorAction);
    }
  });
}

function createErrorNotification(err) {
  if(err.status === 500) {
    return NotificationActions.createError(err.statusText || 'Internal Server Error');
  }

  if (err.status !== 401) {
    var errMessages = [];
    if (err.data) {
      try {
        for (var prop in err.data) {
          var msg = err.data[prop];
          if (_.isArray(msg)) {
            msg = msg.join(' ');
          }

          errMessages.push(`${prop}: ${msg}`);
        }
      } catch (ex) {
        console.error(ex);
      }
    }

    var errMessage = '';
    if (errMessages.length === 1) {
      errMessage = errMessages[0];
    }
    else {
      errMessage = errMessages.join('\n\n');
    }

    var message = err.message || errMessage || (err.responseText ? ('Error: ' + err.responseText) : 'Error (see console logs)');

    return NotificationActions.createError(message);
  }
}

