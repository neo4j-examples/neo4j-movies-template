module.exports = function (config) {
  config.set({
    browsers: [
      'PhantomJS'
    ],
    files: [
      {
        pattern: 'tests.webpack.js',
        watched: false
      }
    ],
    frameworks: [
      'jasmine',
      'jasmine-matchers'
    ],
    preprocessors: {
      'tests.webpack.js': [
        'webpack'
      ]
    },
    reporters: ['progress', 'junit'],
    junitReporter: {
      outputDir: '../test_output', // results will be saved as $outputDir/$browserName.xml
      outputFile: undefined, // if included, results will be saved as $outputDir/$browserName/$outputFile
      suite: '' // suite will become the package name attribute in xml testsuite element
    },
    webpack: {
      module: {
        loaders: [
          {test: /\.jsx?$/, exclude: /node_modules|bower_components/, loader: 'babel'},
          {test: /\.js/, exclude: /node_modules|bower_components/, loader: 'babel'}
        ]
      },
      watch: true,
      plugins: []
    },
    webpackServer: {
      noInfo: true
    }
  });
};
