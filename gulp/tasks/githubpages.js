(function (){
  'use strict';

  var
  ghPages = require('gulp-gh-pages'),
  paths    = require('../paths');


  module.exports = function(gulp, plugins) {

    gulp.task('deploy:github-pages', ['build'], function() {
      return gulp.src(paths.deploy.pages).pipe(ghPages());
    });

  };
}());
