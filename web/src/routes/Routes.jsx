import React, {PropTypes} from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute } from 'react-router';
import App from '../pages/App.jsx';
import Home from '../pages/Home.jsx';
import Movie from '../pages/Movie.jsx';
import Person from '../pages/Person.jsx';

export default class Routes extends React.Component {

  render() {
    return (
      <Router history={this.props.browserHistory}>
        <Route name="Home" path="/" component={App}>
          <IndexRoute name="Home" component={Home}/>
          <Route name="Movie" path="movie/:id" component={Movie}/>
          <Route name="Person" path="person/:id" component={Person}/>
        </Route>
      </Router>
    );
  }
}

Routes.displayName = 'Routes';

Routes.propTypes = {
  browserHistory: PropTypes.object.isRequired
};
