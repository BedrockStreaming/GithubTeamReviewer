'use strict';

var gulp = require('gulp');
var del  = require('del');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'uglify-save-license', 'run-sequence']
});

var styleStream = function () {
  return gulp.src(['app/scripts/**/*.js', '!app/scripts/config.js'])
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'));
}

gulp.task('scripts', function () {
  return styleStream()
    .pipe($.size());
});

gulp.task('scripts:strict', function () {
  return styleStream()
    .pipe($.jshint.reporter('fail'))
    .pipe($.size());
});

gulp.task('fonts', function() {
   return gulp.src(['app/bower_components/font-awesome/fonts/fontawesome-webfont.*'])
    .pipe(gulp.dest('dist/fonts/'));
});

gulp.task('partials', function () {
  return gulp.src('app/views/**/*.html')
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe($.ngHtml2js({
      moduleName: 'gtrApp',
      prefix: 'views/'
    }))
    .pipe(gulp.dest('.tmp/views'))
    .pipe($.size());
});

gulp.task('html', ['scripts:strict', 'partials'], function () {
  var htmlFilter = $.filter('*.html');
  var jsFilter = $.filter('**/*.js');
  var cssFilter = $.filter('**/*.css');
  var assets;

  return gulp.src('app/*.html')
    .pipe($.inject(gulp.src('.tmp/views/**/*.js'), {
      read: false,
      starttag: '<!-- inject:partials -->',
      addRootSlash: false,
      addPrefix: '../'
    }))
    .pipe(assets = $.useref.assets())
    .pipe($.rev())
    .pipe(jsFilter)
    .pipe($.ngAnnotate())
    .pipe($.uglify({preserveComments: $.uglifySaveLicense}))
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe($.csso())
    .pipe(cssFilter.restore())
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.revReplace())
    .pipe(htmlFilter)
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(htmlFilter.restore())
    .pipe(gulp.dest('dist'))
    .pipe($.size());
});

gulp.task('extras', function(){
  return gulp.src(['app/*', '!app/*.html'])
    .pipe(gulp.dest('dist'));
});

gulp.task('clean', function () {
  return del([
    '.tmp',
    'dist'
  ]);
});

gulp.task('build', function (done) {
  $.runSequence(
    'clean',
    ['config', 'wiredep'],
    ['html', 'fonts', 'extras'],
    done
  );
});
gulp.task('build:test', function (done) {
  $.runSequence(
    'clean',
    ['config:test', 'wiredep:dev'],
    ['html', 'extras'],
    done
  );
});
