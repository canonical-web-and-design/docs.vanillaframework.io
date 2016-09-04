(function (){
  'use strict';

  var
  browserSync = require('browser-sync').create(),
  gulp = require('gulp'),
  fs = require('fs'),
  path = require('path'),
  paths = require('./paths'),
  runSequence = require('run-sequence'),
  tasks = fs.readdirSync('./gulp/tasks/');

  var sharedPlugins = {
    browserSync: browserSync
  };

  tasks.forEach(function (task) {
      require(path.join(__dirname, 'tasks', task))(gulp, sharedPlugins);
  });


  gulp.task('help', function() {
    console.log('build - Generate Pattern Library and assets');
    console.log('develop - Generate Pattern Library and watch assets');
    console.log('watch - Watch sass files and generate unminified css');
    console.log('test - Lints Sass');
    console.log('deploy - Deploy sites to Github pages');
  });

  gulp.task('build', ['clean'], function() {
    return runSequence(['metalsmith', 'sass']);
  });

  gulp.task('clean', ['metalsmith:clean', 'sass:clean']);

  gulp.task('deploy', function() {
    return runSequence(['build', 'deploy:github-pages']);
  });

  gulp.task('develop', function() {
    return runSequence(
      'clean',
      'metalsmith',
      'sass:develop',
      'watch',
      'browser-sync'
    );
  });

  gulp.task('test', ['sasslint']);

  gulp.task('watch', ['metalsmith:watch', 'sass:watch']);

  gulp.task('default', ['help']);
}());
