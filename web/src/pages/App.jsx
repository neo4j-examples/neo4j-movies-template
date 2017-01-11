import React, {PropTypes} from 'react';
import { render } from 'react-dom';

import Header from '../components/Header.jsx';
import {getProfile} from '../redux/actions/ProfileActions';
import UserSession from '../UserSession';
import Footer from '../components/Footer.jsx';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import NotificationContainer from '../components/common/NotificationContainer.jsx';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {getGenres} from '../redux/actions/MovieActions';

class App extends React.Component {
  constructor() {
    super();
  }

  componentWillMount() {
    if (UserSession.getToken() && !this.props.profile) {
      this.props.dispatch(getProfile());
    }
  }

  render() {
    var {auth, profile, routes, movie, person, params} = this.props;

    return (
      <div className="nt-app">
        <Header auth={auth}
                profile={profile}/>
        <Breadcrumbs routes={routes}
                     params={params}
                     movie={movie}
                     person={person}/>
        <div className="nt-app-page">
          {this.props.children}
        </div>
        {/*<Footer />*/}
        <NotificationContainer />
      </div>
    );
  }
}
App.displayName = 'App';
App.propTypes = {
  routes: PropTypes.array.isRequired,
  params: PropTypes.object.isRequired,
  children: PropTypes.object,
  movie: PropTypes.object,
  person: PropTypes.object
};

function mapStateToProps(state) {
  return {
    movie: state.movies.detail,
    person: state.person.detail,
    auth: state.auth,
    profile: _.get(state.profile, 'profile', null)
  };
}

export default connect(mapStateToProps)(App);
