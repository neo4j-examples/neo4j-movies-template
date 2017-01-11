'use strict';

require('es6-shim');
require('babel-core/register');
require('babel-polyfill');

import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './routes/Routes.jsx';
import {browserHistory} from 'react-router';
import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import reducers from './redux/reducers';
import sagas from './redux/sagas';
import createLogger from 'redux-logger';
import {routerMiddleware, syncHistoryWithStore} from 'react-router-redux';
import {Provider} from 'react-redux';

// Export React so the dev tools can find it
if (window === window.top) {
  window.React = React;
}

const reduxLoggerMiddleware = createLogger();
const sagaMiddleware = createSagaMiddleware();

// create a store with middlewares
const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware,
  sagaMiddleware,
  reduxLoggerMiddleware,
  routerMiddleware(browserHistory)
)(createStore);
const store = createStoreWithMiddleware(reducers);
const history = syncHistoryWithStore(browserHistory, store);
sagaMiddleware.run(sagas);

ReactDOM.render(
  <Provider store={store}>
    <Routes browserHistory={history}/>
  </Provider>,
  document.getElementById('app')
);
