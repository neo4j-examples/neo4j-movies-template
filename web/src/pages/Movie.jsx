import React from 'react';

export default class Movie extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="nt-movie">
        <h2>Movie!</h2>
      </div>
    );
  }
}
Movie.displayName = 'Movie';
