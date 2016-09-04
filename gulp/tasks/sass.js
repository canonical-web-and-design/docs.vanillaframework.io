(function (){
  'use strict';

  var
  autoprefixer = require('gulp-autoprefixer'),
  cssnano = require('gulp-cssnano'),
  del = require('del'),
  sass = require('gulp-sass'),
  scsslint = require('gulp-scss-lint'),
  paths    = require('../paths'),
  plumber = require('gulp-plumber');


  var autoprefixerOptions = {
    browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1']
  };

  var sassOptions = {
    includePaths: [paths.sass.includes.vfNode]
  };


  module.exports = function(gulp, plugins) {

    gulp.task('sasslint', function() {
      return gulp.src(paths.src.sass)
        .pipe(scsslint())
        .pipe(scsslint.failReporter());
    });

    gulp.task('sass', function() {
      return gulp.src(paths.src.sass)
        .pipe(sass(sassOptions))
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(gulp.dest(paths.build.css));
    });

    gulp.task('sass:develop', function() {
      gulp.src([paths.src.sass])
        .pipe(plumber())
        .pipe(sass(sassOptions))
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(gulp.dest(paths.build.css))
        .pipe(plugins.browserSync.stream());
    });

    gulp.task('sass:watch', function() {
      gulp.watch([
        paths.src.sass,
        paths.src.vfSass
      ], ['sass:develop']);
    });

    gulp.task('sass:clean', function() {
      return del([paths.build.files.css]);
    });

  };
}());
