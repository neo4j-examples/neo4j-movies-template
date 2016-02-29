import { combineReducers } from 'redux';
import genres from './genres';
import movies from './movies';
import person from './person';

const rootReducer = combineReducers({
  genres,
  movies,
  person
});

export default rootReducer;
