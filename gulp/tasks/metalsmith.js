(function (){
  'use strict';

  var
  del = require('del'),
  metalsmith = require('metalsmith'),
  metalsmithCollections = require('metalsmith-collections'),
  metalsmithFilter = require('metalsmith-filter'),
  metalsmithLayouts = require('metalsmith-layouts'),
  metalsmithMarkdown   = require('metalsmith-markdown'),
  metalsmithPermalinks = require('metalsmith-permalinks'),
  paths    = require('../paths');


  var
  collectionsConfig = {
    pages: {
      reverse: true
    }
  },

  filterConfig = [
    '**/*.md'
  ],

  permalinksConfig = {
    pattern: ':collection/:title'
  },

  templateConfig = {
    engine: 'handlebars',
    default: 'default.hbt',
    directory: paths.metalsmith.templates,
    partials: paths.metalsmith.partials
  };


  module.exports = function(gulp, plugins) {

    gulp.task('metalsmith:clean-docs', function() {
      return del(paths.import.docs)
    });

    gulp.task('metalsmith:import-docs', ['metalsmith:clean-docs'], function() {
      return gulp.src([paths.src.vfDocs]).pipe(gulp.dest(paths.import.docs));
    });

    gulp.task('metalsmith', ['metalsmith:import-docs'], function() {
      metalsmith(paths.metalsmith.base)
        .source(
          paths.metalsmith.source,
          paths.metalsmith.vfDocs
        )
        .use(metalsmithFilter(filterConfig))
        .destination(paths.metalsmith.destination)
        .use(metalsmithCollections(collectionsConfig))
        .use(metalsmithMarkdown())
        .use(metalsmithPermalinks(permalinksConfig))
        .use(metalsmithLayouts(templateConfig))
        .build(function (err) {
            if(err) console.log(err);
        });
    });

    gulp.task('metalsmith:clean', function() {
      return del([
        paths.build.files.hbt,
        paths.build.files.html
      ]);
    });

    gulp.task('metalsmith:watch', function() {
      gulp.watch([
        paths.src.md,
        paths.src.hbt,
        paths.src.vfDocs
      ], ['metalsmith']);
    });

  };
}());
