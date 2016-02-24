import * as Types from '../actions/PersonActionTypes';

const initialState = {
  isFetching: false,
  isFetchingRelated: false,
  detail: null,
  related: []
};

export default function person(state = {...initialState}, action) {
  switch (action.type) {
    case Types.PERSON_DETAIL_GET_REQUEST:
      return  {
        ...state,
        isFetching: true
      };
    case Types.PERSON_DETAIL_GET_SUCCESS:
      return  {
        ...state,
        isFetching: false,
        detail: action.response
      };
    case Types.PERSON_DETAIL_CLEAR:
      return  {
        ...initialState
      };
    case Types.PERSON_RELATED_GET_REQUEST:
      return  {
        ...state,
        isFetchingRelated: true
      };
    case Types.PERSON_RELATED_GET_SUCCESS:
      return  {
        ...state,
        isFetchingRelated: false,
        related: action.response.related
      };

    default:
      return state;
  }
}
