import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link } from 'react-router';

import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

export default class Home extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="nt-app">
        <Header />
        {this.props.children}
        <Footer />
      </div>
    );
  }
}
Home.displayName = 'Home';
