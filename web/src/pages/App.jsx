import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link } from 'react-router';

export default class Home extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="nt-movies">
        <h1>App</h1>
        {this.props.children}
      </div>
    );
  }
}
Home.displayName = 'Home';
