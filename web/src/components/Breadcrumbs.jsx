import React from 'react';
import { Link } from 'react-router';

export default class Breadcrumbs extends React.Component {
  render() {
    var {routes, movie, person, params} = this.props;

    return (
      <ul className="breadcrumbs">
        <li><Link to="/" className={movie ? '' : 'current'}>Home</Link></li>
        {
          movie ?
            <li><Link to={`/movie/${movie.id}`} className="current">{movie.title}</Link></li>
            : null
        }
        {
          person ?
            <li><Link to={`/person/${person.id}`} className="current">{person.name}</Link></li>
            : null
        }
      </ul>
    );
  }
}

Breadcrumbs.displayName = 'Breadcrumbs';
