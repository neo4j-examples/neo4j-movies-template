import React, {PropTypes} from "react";
import {render} from "react-dom";
import {Router, Route, IndexRoute} from "react-router";
import App from "../pages/App.jsx";
import Home from "../pages/Home.jsx";
import Movie from "../pages/Movie.jsx";
import Person from "../pages/Person.jsx";
import Login from "../pages/Login.jsx";
import Signup from "../pages/Signup.jsx";
import SignupStatus from "../pages/SignupStatus.jsx";
import Profile from "../pages/Profile.jsx";

export default class Routes extends React.Component {

  render() {
    return (
      <Router history={this.props.browserHistory}>
        <Route path="/" component={App}>
          <IndexRoute component={Home}/>
          <Route path="movie/:id" component={Movie}/>
          <Route path="person/:id" component={Person}/>
          <Route path="login" component={Login}/>
          <Route path="signup" component={Signup}/>
          <Route path="signup-status" component={SignupStatus}/>
          <Route path="profile" component={Profile}/>
        </Route>
      </Router>
    );
  }
}

Routes.displayName = 'Routes';

Routes.propTypes = {
  browserHistory: PropTypes.object.isRequired
};
