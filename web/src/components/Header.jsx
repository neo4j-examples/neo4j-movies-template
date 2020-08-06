import React from 'react';
import {Link} from 'react-router-dom';
import {logout} from '../redux/actions/AuthActions';
import {connect} from 'react-redux';
import _ from 'lodash';
import logoImg from '../assets/logo.png';

class Header extends React.Component {
  render() {
    var {props} = this;
    var profile = _.get(props, 'profile');
    var isLoggedIn = !!_.get(props, 'auth.token');

    return (
      <nav className="nt-app-header">
        <div className="nt-app-header-logo">
          <Link to="/">
            <img src={logoImg} alt="" />
          </Link>
        </div>
        <ul className="nt-app-header-links">
          <li>
            <a className="nt-app-header-link"
               href="https://github.com/neo4j-examples/neo4j-movies-template"
               target="_blank"
               rel="noopener noreferrer">
              GitHub Project
            </a>
          </li>
        </ul>
        <div className="nt-app-header-profile-links">
          <div className="right">
            {
              profile ?
                <div className="nt-app-header-avatar" style={this.getAvatarStyle(profile)}>
                  <Link to="/profile" title={`profile: ${profile.username}`}/>
                </div>
                : null
            }
            <div className="log-container">
              {isLoggedIn ? <button onClick={this.logout.bind(this)} className="buttonLink logout">Log out</button> : <Link to="/login">Log in</Link>}
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
