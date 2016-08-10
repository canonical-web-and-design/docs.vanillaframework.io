'use strict'

var
// defaults
consoleLog = false, // set true for metalsmith file and meta content logging
devBuild = ((process.env.NODE_ENV || '').trim().toLowerCase() !== 'production'),
pkg = require('./package.json'),

// main directories
dir = {
  base: __dirname + '/',
  src: './src/',
  dest: './build/',
  vf: './node_modules/vanilla-framework/'
},

// template config
templateConfig = {
  engine:     'handlebars',
  directory:  './src/templates/',
  partials:   './src/partials/',
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
gulp = require('gulp'),
rename = require('gulp-rename'),
sass = require('gulp-sass'),
exec = require('child_process').exec,
autoprefixer = require('gulp-autoprefixer'),
gutil = require('gulp-util'),
scsslint = require('gulp-scss-lint'),
cssnano = require('gulp-cssnano'),
util = require('util'),
concat = require('gulp-concat'),
browserSync = require('browser-sync').create(),
reload      = browserSync.reload,
ghPages = require('gulp-gh-pages'),
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
  console.log('import-docs-from-master - Import docs from the master branch of vanilla-framework');
});

// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./build"
        }
    });

    gulp.watch("./build/**/*.html").on("change", reload);
});

/* Import docs from Vanilla Framework dep */
gulp.task('import-docs', function() {
  gulp.src([dir.vf + 'docs/**/*.md']).pipe(gulp.dest('src/docs'));
});

/* Generate Pattern Library with Metalsmith */
gulp.task('pattern-library', ['import-docs'], function() {
  metalsmith(dir.base)
    .clean(!devBuild) // clean folder before a production build
    .source(dir.src) // source folder (src/)
    .destination(dir.dest) // build folder (build/)
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
        if(err) console.log(err)
    })
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
  var path = (gutil.env.file)? gutil.env.file : '**/*.scss';
  return gulp.src('scss/' + path)
    .pipe(scsslint())
    .pipe(scsslint.failReporter());
});

gulp.task('sass-build', function() {
  return gulp.src('scss/**/*.scss')
    .pipe(sass({
      includePaths: ['node_modules']
    }))
    .pipe(sass({
      style: 'expanded',
      errLogToConsole: true,
      onError: throwSassError
    }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
    .pipe(cssnano())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('build/css/'));
});

gulp.task('sass-develop', function() {
  return gulp.src(['scss/**/*.scss'])
    .pipe(sass({
      includePaths: ['node_modules']
    }))
    .pipe(sass({ style: 'expanded', errLogToConsole: true }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
    .pipe(gulp.dest('build/css/'))
    .pipe(browserSync.stream());
});

gulp.task('deploy', ['build'], function() {
  return gulp.src('./build/**/*')
    .pipe(ghPages());
});

gulp.task('watch', function() {
  gulp.watch(['scss/**/*.scss', dir.vf + 'scss/**/*.scss'], ['sass-develop']);
  gulp.watch([dir.vf + 'docs/**/*.md', '*.md', 'partials/**/*.hbt', 'templates/**/*.hbt', 'pages/**/*.md'], ['pattern-library']);
});

// Get the latest docs from the master branch
gulp.task('import-docs-from-master', function() {
  exec('bin/import-docs-from-master', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
  });
});

gulp.task('develop', ['pattern-library', 'sass-develop', 'watch', 'browser-sync']);

gulp.task('test', ['sasslint']);

gulp.task('build', ['pattern-library', 'sass-build']);

gulp.task('default', ['help']);
