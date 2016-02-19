'use strict';

require('es6-shim');

import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './routes/Routes.jsx';

import { createStore, applyMiddleware } from 'redux';
import reducers from './redux/reducers';
import createApiMiddleware from './redux/middleware/callAPIMiddleware';
import {API_FAILURE} from './redux/actions/ApiActionTypes'
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import { Provider } from 'react-redux';
import { syncHistory } from 'react-router-redux';
import { browserHistory } from 'react-router';

// Export React so the dev tools can find it
if (window === window.top) {
  window.React = React;
}

//create redux action logger
const reduxLogger = createLogger();
const callApiMiddleware = createApiMiddleware({defaultFailureType: API_FAILURE});

// set up redux-simple-router (react-router state being part of redux sotre's state)
//const history = createBrowserHistory();
const reduxRouterMiddleware = syncHistory(browserHistory);

// create a store with middlewares
const createStoreWithMiddleware = applyMiddleware(
  reduxRouterMiddleware,
  thunkMiddleware,
  callApiMiddleware,
  reduxLogger
)(createStore);

const store = createStoreWithMiddleware(reducers);

ReactDOM.render(
  <Provider store={store}>
    <Routes browserHistory={browserHistory}/>
  </Provider>,
  document.getElementById('app')
);
