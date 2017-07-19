'use strict';

var gulp = require('gulp');
var path = require('path');
var SeleniumConfig = require('webdriver-manager/built/lib/config').Config;
var SeleniumStandAlone = require('webdriver-manager/built/lib/binaries/stand_alone').StandAlone;

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
gulp.task('webdriver-update', function (done) {
  $.protractor.webdriver_update({
    browsers: ['chrome', 'versions.chrome=2.30', 'versions.standalone=3.4.0']
  }, done)
});

gulp.task('webdriver-standalone', $.protractor.webdriver_standalone);

gulp.task('protractor-only', ['webdriver-update'], function (done) {
  var testFiles = [
    'test/e2e/**/*.js'
  ];

  var seleniumStandAlone = new SeleniumStandAlone();
  seleniumStandAlone.versionCustom = '3.4.0';
  var seleniumServerJar = path.resolve(SeleniumConfig.getSeleniumDir(), seleniumStandAlone.executableFilename());

  gulp.src(testFiles)
    .pipe($.protractor.protractor({
      args: ['--seleniumServerJar='+seleniumServerJar],
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

gulp.task('test', function (done) {
  $.runSequence(
    ['scripts-tests', 'scripts:strict', 'serve:e2e', 'wiredep:dev'],
    'protractor-only',
    done
  );
});

gulp.task('test:dist', function (done) {
  $.runSequence(
    ['scripts-tests', 'serve:e2e-dist'],
    'protractor-only',
    done
  );
});
