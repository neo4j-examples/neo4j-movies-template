import * as Types from '../actions/ProfileActionTypes';
import {LOGOUT} from '../actions/AuthActionTypes';

export default function profile(state = getInitialState(null), action) {
  switch (action.type) {
    case LOGOUT:
      return getInitialState();
    default:
      return state;
    case Types.PROFILE_GET:
    case Types.PROFILE_GET_RATINGS:
    case Types.PROFILE_GET_RECOMMENDATIONS:
      return {
        ...state,
        isFetching: true
      };
    case Types.PROFILE_GET_FAILURE:
    case Types.PROFILE_GET_RATINGS_FAILURE:
    case Types.PROFILE_GET_RECOMMENDATIONS_FAILURE:
      return {
        ...state,
        isFetching: false
      };
    case Types.PROFILE_GET_SUCCESS:
      return {
        ...state,
        isFetching: false,
        profile: action.payload
      };
    case Types.PROFILE_GET_RATINGS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        ratedMovies: action.payload
      };
    case Types.PROFILE_GET_RECOMMENDATIONS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        recommendedMovies: action.payload
      };
  }
}

function getInitialState() {
  return {
    isFetching: false,
    profile: null,
    ratedMovies: [],
    recommendedMovies: []
  };
}
