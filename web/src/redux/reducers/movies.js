import * as Types from '../actions/MovieActionTypes';

const initialState = {
  isFetchingFeatured: false,
  isFetchingByGenre: false,
  isFetching: false,
  featured: [],
  byGenre: {},
  detail: null
};

export default function movies(state = initialState, action) {
  switch (action.type) {
    case Types.MOVIES_FEATURED_GET_REQUEST:
      return  {
        ...state,
        isFetchingFeatured: true,
        isFetching: true
      };
    case Types.MOVIES_FEATURED_GET_SUCCESS:
      return  {
        ...state,
        isFetchingFeatured: false,
        isFetching: getIsFetching(false),
        featured: action.response
      };
    case Types.MOVIES_BY_GENRES_GET_REQUEST:
      return  {
        ...state,
        isFetchingByGenre: true,
        isFetching: true
      };
    case Types.MOVIES_BY_GENRES_GET_SUCCESS:
      return  {
        ...state,
        isFetchingByGenre: false,
        isFetching: getIsFetching(false),
        byGenre: action.response
      };
    case Types.MOVIE_DETAIL_GET_REQUEST:
      return  {
        ...state,
        isFetching: true
      };
    case Types.MOVIE_DETAIL_GET_SUCCESS:
      return  {
        ...state,
        isFetching: false,
        detail: action.response
      };
    case Types.MOVIE_DETAIL_CLEAR:
      return  {
        ...state,
        detail: null
      };
    default:
      return state;
  }
}

function getIsFetching(state, isFetching) {
  return (state.isFetchingByGenre || state.isFetchingFeatured || isFetching);
}
