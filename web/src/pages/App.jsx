import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Header from '../components/Header.jsx';
import {getProfile} from '../redux/actions/ProfileActions';
import UserSession from '../UserSession';
// import Footer from '../components/Footer.jsx';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import NotificationContainer from '../components/common/NotificationContainer.jsx';

import { connect } from 'react-redux';
import "../styles/main.scss";

class App extends React.Component {
  componentDidMount() {
    if (UserSession.getToken() && !this.props.profile) {
      this.props.dispatch(getProfile());
    }
  }

  render() {
    var {auth, profile, movie, person} = this.props;

    return (
      <div className="nt-app">
        <Header auth={auth}
                profile={profile}/>
        <Breadcrumbs movie={movie}
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
