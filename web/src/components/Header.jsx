import React from 'react';
import {Link} from 'react-router';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
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
      </nav>
    );
  }
}

Header.displayName = 'Header';