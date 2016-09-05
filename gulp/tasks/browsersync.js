(function (){
  'use strict';

  var
  browserSync = require('browser-sync').create(),
  extend = require('extend'),
  optional = require('optional'),
  paths    = require('../paths');


  var browsersyncFiles = [
    paths.browserSync.css,
    paths.browserSync.html
  ];

  var browsersyncConfig = {
    server: {
        baseDir: paths.build.html
    }
  };

  var bsLocalConfig = optional('./browsersync.local.json');
  extend(browsersyncConfig, bsLocalConfig);


  module.exports = function(gulp, plugins) {

    gulp.task('browser-sync', function() {
      plugins.browserSync.init(browsersyncFiles, browsersyncConfig);
    });

  };
}());
