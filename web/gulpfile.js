'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var path = require('path');
var merge = require('merge-stream');
var runSequence = require('run-sequence');
var webpack = require('webpack');
var browserSync = require('browser-sync');
var argv = require('minimist')(process.argv.slice(2));
var url = require('url');
var fs = require('fs');
var handlebars = require('gulp-compile-handlebars');
var rename = require('gulp-rename');
var git = require('git-rev');
var gutil = require('gulp-util');
var sourceMaps = require('gulp-sourcemaps');

// Settings
var COMMIT_HASH;
var DEST = './build';                         // The build output folder
var RELEASE = !!argv.release;                 // Minimize and optimize during a build?
var GOOGLE_ANALYTICS_ID = 'UA-XXXXX-X';       // https://www.google.com/analytics/web/
var AUTOPREFIXER_BROWSERS = [                 // https://github.com/ai/autoprefixer
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

var paths = {
  sassWatchDir: ['./src/styles/**/*.scss'],
  sassDir: ['./src/styles/*.scss'],
  cssOutputDir: './build/css'
};

var options = {};

options = {
  sass: {
    errLogToConsole: true,
    includePaths: [
      //'bower_components/bootstrap-sass-official/assets/stylesheets/',
      'bower_components/foundation/scss/',
      'bower_components/normalize-css/',
      'bower_components/open-iconic/font/css/',
      'bower_components/super-gradient/',
      'node_modules/font-awesome/scss/'
    ]
  },
  maps: {
    loadMaps: true
  },
  browserSync: {
    port: 4000,
    notify: false,
    //browser: 'blah', // stop auto opening browsers
    // Customize the BrowserSync console logging prefix
    logPrefix: 'RSK',
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: {
      baseDir: DEST,
      index: 'index.html',
      // Allow web page requests without .html file extension in URLs
      // send back index.html to support pushState
      middleware: function (req, res, next) {
        var uri = url.parse(req.url);
        if (uri.pathname.length > 1 &&
          path.extname(uri.pathname) === '') {
          req.url = '/index' + '.html' + (uri.search || '');
        }
        next();
      }
    }
  }
};

// Handlebars helper to tack on commit hash to asset names
var handlebarOpts = {
  helpers: {
    version: function (path, context) {
      if (RELEASE) {
        var commit = context.data.root['commit'];
        return path + '?' + commit;
      } else {
        return path;
      }
    }
  }
};

var src = {};
var watch = false;
var pkgs = (function () {
  var pkgs = {};
  var map = function (source) {
    for (var key in source) {
      pkgs[key.replace(/[^a-z0-9]/gi, '')] = source[key].substring(1);
    }
  };
  map(require('./package.json').dependencies);
  return pkgs;
}());

// The default task
gulp.task('default', ['serve']);

// Clean up
gulp.task('clean', del.bind(null, [DEST]));

gulp.task('rev', function (cb) {
  git.short(function (hash) {
    COMMIT_HASH = hash;
    cb();
  });
});

gulp.task('compile_index', function () {
  src.index = 'src/pages/index.hbs';
  var ctx = {
    commit: COMMIT_HASH
  };

  // read in our handlebars template, compile it using
  // our ctx, and output it to index.html
  return gulp.src(src.index)
    .pipe(handlebars(ctx, handlebarOpts))
    .pipe(rename('index.html'))
    .pipe(gulp.dest(DEST));
});

// Copy files from 3rd party libraries to DEST dir
gulp.task('vendor', function () {
  return merge(
    gulp.src('./src/styles/iconic/fonts/*')
      .pipe(gulp.dest(DEST + '/fonts'))
  );
});

// TODO: Watch the /bower_components directory so it copies to /build on changes
// Copy files from 3rd party libraries to DEST dir
gulp.task('bower', function () {
  return gulp.src('./bower_components/**')
    .pipe(gulp.dest(DEST + '/bower_components'));
});

// Static files
gulp.task('assets', function () {
  src.assets = 'src/assets/**';
  return gulp.src(src.assets)
    .pipe($.changed(DEST))
    .pipe(gulp.dest(DEST))
    .pipe($.size({title: 'assets'}));
});

// Images
gulp.task('images', function () {
  src.images = 'src/images/**';
  return gulp.src(src.images)
    .pipe($.changed(DEST + '/images'))
    .pipe($.if(RELEASE, $.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest(DEST + '/images'))
    .pipe($.size({title: 'images'}));
});

// HTML pages
gulp.task('pages', function () {
  src.pages = ['src/pages/404.html', 'src/pages/index.html'];
  // TODO: No pre-render until cherrytree router is shimmed.
  // var render = $.render({template: './src/pages/_template.html'})
  //   .on('error', function(err) {
  //     console.log(err);
  //     render.end();
  //   });

  return gulp.src(src.pages)
    .pipe($.changed(DEST, {extension: '.html'}))
    // .pipe($.if('*.jsx', render))
    .pipe($.replace('UA-XXXXX-X', GOOGLE_ANALYTICS_ID))
    .pipe($.if(RELEASE, $.htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      minifyJS: true
    }), $.jsbeautifier()))
    .pipe(gulp.dest(DEST))
    .pipe($.size({title: 'pages'}));
});

// CSS style sheets
gulp.task('styles', function () {
  return gulp.src(paths.sassWatchDir)
    .pipe($.plumber(function (err) {
      gutil.log(gutil.colors.red('STYLES ERROR:'), err);
    })) // Node streams are kinda broken so this is needed
    .pipe(sourceMaps.init({debug: true}))

    .pipe($.sass(options.sass))

    .pipe(RELEASE ? $.autoprefixer({browsers: AUTOPREFIXER_BROWSERS}) : gutil.noop())
    .pipe(RELEASE ? $.csscomb() : gutil.noop())
    .pipe(RELEASE ? $.minifyCss() : gutil.noop())

    .pipe(sourceMaps.write('.'))
    .pipe(gulp.dest(paths.cssOutputDir))
    .pipe($.filter('**/*.css')) // Filtering stream to only css files
    .pipe(browserSync.reload({stream: true}))
    .pipe($.size({title: 'styles'}));
});

var config = require('./config/webpack.js')(RELEASE);
var compiler = webpack(config);
// Bundle
gulp.task('bundle', function (cb) {
  src.scripts = ['src/**/*{.js,.jsx}', 'config/settings.js'];
  compiler.run(function (err, stats) {
    if (err) {
      throw new gutil.PluginError("bundle", err);
    }
    gutil.log("[bundle]", stats.toString({
      modules: false,
      assets: false,
      chunks: false,
      chunkModules: false,
      reasons: false,
      source: false,
      hash: false,
      version: false,
      colors: true
    }));
    browserSync.reload();
    cb();
  });
});

// Build the app from source code
gulp.task('build', ['clean'], function (cb) {
  if (RELEASE) {
    runSequence([
      'vendor', 'bower', 'assets', 'images', 'pages', 'styles',
      'bundle'
    ], 'rev', 'compile_index', cb);
  } else {
    runSequence([
      'vendor', 'bower', 'assets', 'images', 'pages', 'styles',
      'bundle', 'compile_index'
    ], cb);
  }
});

// Launch a lightweight HTTP Server
gulp.task('serve', function (cb) {
  watch = true;

  runSequence('build', function () {
    browserSync(options.browserSync);

    gulp.watch(src.index, ['compile_index']);
    gulp.watch(src.assets, ['assets']);
    gulp.watch(src.images, ['images']);
    gulp.watch(src.pages, ['pages']);
    gulp.watch(paths.sassWatchDir, ['styles']);
    gulp.watch(src.scripts, ['bundle']);

    cb();
  });
});
