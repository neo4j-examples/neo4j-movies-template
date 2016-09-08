import * as Types from "../actions/ProfileActionTypes";
import {LOGOUT} from "../actions/AuthActionTypes";

export default function profile(state = getInitialState(null), action) {
  switch (action.type) {
    case LOGOUT:
      return getInitialState(null);
    default:
      return state;
    case Types.PROFILE_GET:
      return {
        ...state,
        isFetching: true
      };
    case Types.PROFILE_GET_SUCCESS:
      return {
        ...state,
        isFetching: false,
        profile: action.payload
      };
  }
}

function getInitialState(profile) {
  return {
    isFetching: false,
    profile
  }
}
