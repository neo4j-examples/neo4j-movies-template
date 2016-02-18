var Immutable = require('immutable');

/**
 * ES6 polyfills
 */
require('es6-shim');

/**
 * Create a set of webpack module ids for our project's modules, excluding
 * tests. This will be used to clear the module cache before each test.
 */
var projectContext = require.context('../client', true, /^((?!__tests__).)*.jsx?$/);
var projectModuleIds = Immutable.Set(
  projectContext.keys().map(module => (
    String(projectContext.resolve(module))
  ))
);

beforeEach(() => {
  /**
   * Clear the module cache before each test. Many of our modules, such as
   * Stores and Actions, are singletons that have state that we don't want to
   * carry over between tests. Clearing the cache makes `require(module)`
   * return a new instance of the singletons. Modules are still cached within
   * each test case.
   */
  var cache = require.cache;
  projectModuleIds.forEach(id => delete cache[id]);

  /**
   * Automatically mock the built in setTimeout and setInterval functions.
   */
  //jasmine.clock().install();
});

afterEach(() => {
  //jasmine.clock().uninstall();
});

/**
 * Load each test using webpack's dynamic require with contexts.
 */
var context = require.context('../client', true, /-test\.js?$/);
context.keys().forEach(context);
