import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link } from 'react-router';

import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {getGenres} from '../redux/actions/MovieActions';

export default class App extends React.Component {
  constructor() {
    super();
  }

  //componentWillMount() {
  //  this.props.getGenres();
  //}

  render() {
    return (
      <div className="nt-app">
        <Header />
        <div className="nt-app-page">
          {this.props.children};
        </div>
        {/*<Footer />*/}
      </div>
    );
  }
}
App.displayName = 'App';

//function mapStateToProps(state) {
//  return {
//    genres: state.genres.genres
//  }
//}
//
//function mapDispatchToProps(dispatch) {
//  return bindActionCreators({getGenres}, dispatch)
//}

//export default connect(mapStateToProps, mapDispatchToProps)(App);