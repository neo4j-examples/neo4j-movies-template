import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import {connect} from 'react-redux';

/**
 * Higher ordered component for pages requiring authentication.
 */
var AuthenticatedPage = (PageComponent) => {

  class AuthenticatedPage extends React.Component {

    constructor() {
      super();

      this.redirectOnLogout = this.redirectOnLogout.bind(this);
    }

    componentWillMount() {
      var {auth, location, history} = this.props;

      if (!auth.token) {
        var query = {redirectTo: (location.pathname + location.search)};
        history.push({pathname: '/login', query});
      }
    }

    componentWillReceiveProps(nextProps) {
      this.redirectOnLogout(nextProps);
    }

    redirectOnLogout(props) {
      var {auth, location, history} = props;

      if (!auth.token && location.pathname !== '/login') {
        history.push('/login');
      }
    }

    render() {
      var {auth} = this.props;
      if (!auth.token) {
        return null;
      }

      return (<PageComponent ref="page" {...this.props}/>);
    }
  }

  AuthenticatedPage.displayName = 'AuthenticatedPage';
  AuthenticatedPage.contextTypes = {
    router: PropTypes.object.isRequired
  };

  function mapStateToProps(state) {
    return {
      auth: state.auth
    };
  }

  // Wrap the component to inject dispatch and state into it
  return connect(mapStateToProps)(withRouter(AuthenticatedPage));
};

export default AuthenticatedPage;

