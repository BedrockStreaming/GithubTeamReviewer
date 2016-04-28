'use strict';

var gulp = require('gulp');

var browserSync = require('browser-sync');

var middleware = require('./proxy');

function browserSyncInit(baseDir, files, browser, notify) {
  browser = browser === undefined ? 'default' : browser;
  notify = notify === undefined ? true : notify;

  browserSync.instance = browserSync.init(files, {
    startPath: '/index.html',
    server: {
      baseDir: baseDir,
      middleware: middleware
    },
    browser: browser,
    port: 9000,
    notify: notify
  });

}

gulp.task('serve', ['watch', 'config'], function () {
  browserSyncInit([
    'app'
  ], [
    'app/**/*.css',
    'app/*.html',
    'app/**/*.html',
    'app/**/*.js'
  ]);
});

gulp.task('serve:dist', ['build'], function () {
  browserSyncInit('dist');
});

gulp.task('serve:e2e', ['config:test'], function () {
  browserSyncInit(['app', '.tmp'], null, [], false);
});

gulp.task('serve:e2e-dist', ['build:test'], function () {
  browserSyncInit('dist', null, [], false);
});
