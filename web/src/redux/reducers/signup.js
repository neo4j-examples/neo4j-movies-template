import * as Types from '../actions/ProfileActionTypes';
import ErrorUtils from '../../utils/ErrorUtils';

function getInitialState() {
  return {
    isSaving: false,
    savedProfile: null,
    errors: {}
  };
}

export default function createProfile(state = getInitialState(), action) {
  switch (action.type) {
    case Types.PROFILE_CREATE_INIT:
      return getInitialState();
    case Types.PROFILE_CREATE:
      return {
        ...state,
        isSaving: true
      };
    case Types.PROFILE_CREATE_SUCCESS:
      return {
        ...state,
        isSaving: false,
        savedProfile: action.payload
      };
    case Types.PROFILE_CREATE_FAILURE:
      return {
        isSaving: false,
        savedProfile: null,
        errors: ErrorUtils.getApiErrors(action.error)
      };
    default:
      return state;
  }
}
