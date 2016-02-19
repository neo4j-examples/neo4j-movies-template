import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link } from 'react-router';

export default class Home extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="nt-home">
        <h2>Homepage!</h2>
      </div>
    );
  }
}
Home.displayName = 'Home';
