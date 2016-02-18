import React, {PropTypes} from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute } from 'react-router';
import App from '../pages/App.jsx';
import Home from '../pages/Home.jsx';

export default class Routes extends React.Component {

  render() {
    return (
      <Router history={this.props.browserHistory}>
        <Route path="/" component={App}>
          <IndexRoute component={Home}/>
        </Route>
      </Router>
    );
  }
}

Routes.displayName = 'Routes';

Routes.propTypes = {
  browserHistory: PropTypes.object.isRequired
};
