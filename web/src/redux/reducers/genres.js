import { MOVIE_GENRES_GET_REQUEST, MOVIE_GENRES_GET_SUCCESS } from '../actions/MovieActionTypes';

const initialState = {
  isFetching: false,
  items: []
};

export default function genres(state = initialState, action) {
  switch (action.type) {
    case MOVIE_GENRES_GET_REQUEST:
      return  {
        ...state,
        isFetching: true
      };
    case MOVIE_GENRES_GET_SUCCESS:
      return  {
        ...state,
        isFetching: false,
        items: action.genres
      };
    default:
      return state;
  }
}
