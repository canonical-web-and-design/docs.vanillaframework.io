(function (){
  'use strict';

  var
  build = 'build',
  src = 'src',
  vanillaFramework = 'node_modules/vanilla-framework';

  module.exports = {
    import: {
      docs: src + '/docs',
    },

    src: {
      hbt: src + '/**/*.hbt',
      img: src + '/img/**/*',
      js: src + '/js/**/*.js',
      md: src + '/src/**/*.md',
      sass: 'scss/**/*.scss',
      vfDocs: vanillaFramework + '/docs/**/*.md',
      vfSass: 'scss/**/*.scss'
    },

    build: {
      css: build + '/css',
      docs: build + '/docs',
      html: './build/',
      img: build + '/img',
      js: build + '/js',
      files: {
        css: build + '/css/**/*.css',
        html: build + '/**/*.html',
        img: build + '/img/**/*',
        js: build + '/js/**/*.js'
      }
    },

    deploy: {
      pages: build + '/**/*'
    },

    browserSync: {
      html: build + '/**/*.html',
      js: build + '/js/**/*.js',
      css: build + '/css/**/*.css',
      img: build + '/img/**/*'
    },

    metalsmith: {
      base: './',
      source: src + '/',
      destination: build + '/',
      partials: src + '/partials/',
      templates: src + '/templates/'
    },

    sass: {
      includes: {
        vfNode: 'node_modules'
      }
    }
  };
}());
