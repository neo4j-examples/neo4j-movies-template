import {combineReducers} from "redux";
import {routerReducer} from "react-router-redux";
import auth from "./auth";
import signup from "./signup";
import profile from "./profile";
import genres from "./genres";
import movies from "./movies";
import person from "./person";

const rootReducer = combineReducers({
  routing: routerReducer,
  auth,
  signup,
  profile,
  genres,
  movies,
  person
});

export default rootReducer;
