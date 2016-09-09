import React from 'react';
import {Link} from 'react-router';
import {logout} from "../redux/actions/AuthActions";
import {connect} from "react-redux";

class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var {props} = this;
    var profile = _.get(props, 'profile');
    var isLoggedIn = !!_.get(props, 'auth.token');

    return (
      <nav className="nt-app-header">
        <div className="nt-app-header-logo">
          <Link to="/">
            <img src="/logo.png"/>
          </Link>
        </div>
        <ul className="nt-app-header-links">
          <li>
            <a className="nt-app-header-link"
               href="https://github.com/neo4j"
               target="_blank">
              GitHub Project
            </a>
          </li>
          <li>
            <a className="nt-app-header-link"
               href="http://neo4j.com/"
               target="_blank">
              Neo4j 3.0.3
            </a>
          </li>
        </ul>
        <div className="nt-app-header-profile-links">
          <div className="right">
            {
              profile ?
                <div className="nt-app-header-avatar" style={this.getAvatarStyle(profile)}>
                  <Link to="/profile" title={`profile: ${profile.username}`}></Link>
                </div>
                : null
            }
            <div className="log-container">
              {isLoggedIn ? <a onClick={this.logout.bind(this)} className="logout">Log out</a> : <Link to="/login">Log in</Link>}
            </div>
            <div>
              {isLoggedIn ? null : <Link to="/signup">Sign up</Link>}
            </div>
          </div>
        </div>
      </nav>
    );
  }

  getAvatarStyle(profile) {
    return {background: `url(${_.get(profile, 'avatar.fullSize')}) center`};
  }

  logout() {
    this.props.dispatch(logout());
  }
}

Header.displayName = 'Header';

export default connect()(Header);