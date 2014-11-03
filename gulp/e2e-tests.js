'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')({
   pattern: ['gulp-*', 'browser-sync', 'run-sequence']
});

gulp.task('scripts-tests', function () {
  return gulp.src(['test/**/*.js'])
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.jshint.reporter('fail'))
    .pipe($.size());
});

// Downloads the selenium webdriver
gulp.task('webdriver-update', $.protractor.webdriver_update);

gulp.task('webdriver-standalone', $.protractor.webdriver_standalone);

gulp.task('protractor-only', ['webdriver-update', 'wiredep:dev'], function (done) {
  var testFiles = [
    'test/e2e/**/*.js'
  ];

  gulp.src(testFiles)
    .pipe($.protractor.protractor({
      configFile: 'test/protractor.conf.js'
    }))
    .on('error', function (err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err;
    })
    .on('end', function () {
      // Close browser sync server
      $.browserSync.exit();
      done();
    });
});

gulp.task('test', ['scripts-tests', 'scripts', 'serve:e2e', 'protractor-only']);
gulp.task('test:dist', ['scripts-tests'], function (done) {
  $.runSequence(
    'serve:e2e-dist',
    'protractor-only',
    done
  );
});
