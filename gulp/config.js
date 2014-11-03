'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

var config = function (target) {
  var configFile = 'config/config.json';

  if (typeof target === 'string' && target) {
    configFile = 'config/config_' + target + '.json';
  }

  return gulp.src(configFile)
    .pipe($.ngConfig('gtrApp.config'))
    .pipe($.rename('config.js'))
    .pipe(gulp.dest('app/scripts'));
}

gulp.task('config', function () {
  config();
});

gulp.task('config:test', function () {
  config('test');
});
