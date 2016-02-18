import { combineReducers } from 'redux';
import { routeReducer } from 'react-router-redux';
import genres from './genres';
import movies from './movies';

const rootReducer = combineReducers({
  routing: routeReducer,
  genres,
  movies
});

export default rootReducer;