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

  // defaults
  consoleLog = false, // set true for metalsmith file and meta content logging
  devBuild = ((process.env.NODE_ENV || '').trim().toLowerCase() !== 'production'),
  pkg = require('../package.json'),

  // template config
  templateConfig = {
    engine:     'handlebars',
    directory:  paths.metalsmith.templates,
    partials:   paths.metalsmith.partials,
    default:    'default.hbt'
  },

  siteMeta = {
    devBuild: devBuild,
    version:  pkg.version,
    name:     'Vanilla Framework',
    desc:     'A living Pattern Library showcasing Vanilla Framework',
    author:   'Canonical Web Team',
    contact:  'https://mobile.twitter.com/vanillaframewrk'
  },

  // modules
  rename = require('gulp-rename'),
  del = require('del'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  gutil = require('gulp-util'),
  scsslint = require('gulp-scss-lint'),
  cssnano = require('gulp-cssnano'),
  util = require('util'),
  concat = require('gulp-concat'),
  ghPages = require('gulp-gh-pages'),
  plumber = require('gulp-plumber'),
  runSequence = require('run-sequence'),
  // Metalmsith - pattern library generation
  metalsmith = require('metalsmith'),
  markdown   = require('metalsmith-markdown'),
  layouts = require('metalsmith-layouts'),
  collections = require('metalsmith-collections'),
  permalinks = require('metalsmith-permalinks');

  /* Gulp instructions start here */
  gulp.task('help', function() {
    console.log('sass-build - Generate the min and unminified css from sass');
    console.log('develop - Generate Pattern Library and watch assets');
    console.log('watch - Watch sass files and generate unminified css');
    console.log('test - Lints Sass');
    console.log('deploy - Deploy sites to Github pages');
  });

  /* Import docs from Vanilla Framework dep */
  gulp.task('import-docs', function() {
    gulp.src([paths.src.vfDocs]).pipe(gulp.dest(paths.import.docs));
  });

  /* Generate Pattern Library with Metalsmith */
  gulp.task('pattern-library', ['import-docs'], function() {
    metalsmith(paths.metalsmith.base)
      .clean(!devBuild) // clean folder before a production build
      .source(paths.metalsmith.source) // source folder (src/)
      .destination(paths.metalsmith.destination) // build folder (build/)
      .use(collections({
        pages: {
          reverse: true
        }
      }))
      .use(markdown()) // convert markdown to html
      .use(permalinks({
          pattern: ':collection/:title'
      }))
      .use(layouts(templateConfig)) // layout templating
      .build(function (err) { // build or error log
          if(err) console.log(err);
      });
  });

  /* Helper functions */
  function throwSassError(sassError) {
    throw new gutil.PluginError({
      plugin: 'sass',
      message: util.format(
        "Sass error: '%s' on line %s of %s",
        sassError.message,
        sassError.line,
        sassError.file
      )
    });
  }

  gulp.task('sasslint', function() {
    return gulp.src(paths.src.sass)
      .pipe(scsslint())
      .pipe(scsslint.failReporter());
  });

  gulp.task('sass-build', function() {
    return gulp.src(paths.src.sass)
      .pipe(sass({
        includePaths: [paths.sass.includes.vfNode]
      }))
      .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
      .pipe(gulp.dest(paths.build.css));
  });

  gulp.task('sass-develop', function() {
    return gulp.src([paths.src.sass])
      .pipe(plumber())
      .pipe(sass({
        includePaths: [paths.sass.includes.vfNode]
      }))
      .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
      .pipe(gulp.dest(paths.build.css))
      .pipe(browserSync.stream());
  });

  gulp.task('deploy', ['build'], function() {
    return gulp.src(paths.deploy.pages).pipe(ghPages());
  });

  gulp.task('watch', function() {
    gulp.watch([
      paths.src.sass,
      paths.src.vfSass
    ], ['sass-develop']);
    gulp.watch([
      paths.src.md,
      paths.src.hbt,
      paths.src.vfDocs
    ], ['pattern-library']);
  });

  gulp.task('develop', ['clean'], function() {
    runSequence(
      ['pattern-library', 'sass-develop'],
      'watch',
      'browser-sync'
  );});

  gulp.task('test', ['sasslint']);

  gulp.task('build', ['clean'], function() {
    runSequence(['pattern-library', 'sass-build']);
  });

  gulp.task('docs-clean', function() {
    return del([paths.build.files.html]);
  });

  gulp.task('sass-clean', function() {
    return del([paths.build.files.css]);
  });

  gulp.task('clean', ['sass-clean', 'docs-clean']);

  gulp.task('default', ['help']);
}());
