import { combineReducers } from 'redux';
import { routeReducer } from 'react-router-redux';
import genres from './genres';
import movies from './movies';
import person from './person';

const rootReducer = combineReducers({
  routing: routeReducer,
  genres,
  movies,
  person
});

export default rootReducer;