import * as Types from '../actions/AuthActionTypes';
import UserSession from '../../UserSession';
import ErrorUtils from '../../utils/ErrorUtils';

export default function auth(state = getInitialState(), action) {
  switch (action.type) {
    case Types.LOGIN:
      return {
        ...state,
        isFetching: true,
        errors: {}
      };
    case Types.LOGIN_SUCCESS:
      return {
        ...getInitialState(),
        token: action.token
      };
    case Types.LOGIN_FAILURE:
      return {
        ...state,
        isFetching: false,
        errors: ErrorUtils.getApiErrors(action.error),
      };
    case Types.LOGOUT:
      return {
        ...state,
        token: null
      };
    default:
      return state;
  }
}

function getInitialState() {
  return {
    isFetching: false,
    errors: {},
    token: UserSession.getToken()
  };
}

