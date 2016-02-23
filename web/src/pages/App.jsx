import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link } from 'react-router';

import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import Breadcrumbs from '../components/Breadcrumbs.jsx';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {getGenres} from '../redux/actions/MovieActions';

class App extends React.Component {
  constructor() {
    super();
  }

  render() {
    var {routes, movie, person, params} = this.props;

    return (
      <div className="nt-app">
        <Header />
        <Breadcrumbs routes={routes}
                     params={params}
                     movie={movie}
                     person={person}/>
        <div className="nt-app-page">
          {this.props.children}
        </div>
        {/*<Footer />*/}
      </div>
    );
  }
}
App.displayName = 'App';

function mapStateToProps(state) {
  return {
    movie: state.movies.detail,
    person: state.person.detail
  }
}

export default connect(mapStateToProps)(App);