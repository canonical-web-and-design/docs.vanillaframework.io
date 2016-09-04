(function (){
  'use strict';

  var
  browserSync = require('browser-sync').create(),
  gulp  = require('gulp'),
  fs     = require('fs'),
  path   = require('path'),
  tasks  = fs.readdirSync('./gulp/tasks/');

  var sharedPlugins = {
    browserSync: browserSync
  };

  tasks.forEach(function (task) {
      require(path.join(__dirname, 'tasks', task))(gulp, sharedPlugins);
  });

  var
  paths = require('./paths'),

  // modules
  rename = require('gulp-rename'),
  gutil = require('gulp-util'),
  util = require('util'),
  concat = require('gulp-concat'),
  ghPages = require('gulp-gh-pages'),
  runSequence = require('run-sequence');

  /* Gulp instructions start here */
  gulp.task('help', function() {
    console.log('sass-build - Generate the min and unminified css from sass');
    console.log('develop - Generate Pattern Library and watch assets');
    console.log('watch - Watch sass files and generate unminified css');
    console.log('test - Lints Sass');
    console.log('deploy - Deploy sites to Github pages');
  });

  gulp.task('deploy', ['build'], function() {
    return gulp.src(paths.deploy.pages).pipe(ghPages());
  });

  gulp.task('watch', ['metalsmith-watch', 'sass-watch']);

  gulp.task('develop', ['clean'], function() {
    runSequence(
      ['pattern-library', 'sass-develop'],
      'watch',
      'browser-sync'
  );});

  gulp.task('test', ['sasslint']);

  gulp.task('build', ['clean'], function() {
    runSequence(['metalsmith', 'sass-build']);
  });

  gulp.task('clean', ['metalsmith-clean', 'sass-clean']);

  gulp.task('default', ['help']);
}());
