/**
 *  Welcome to your gulpfile!
 *  The gulp tasks are split into several files in the gulp directory
 *  because putting it all here was too long
 */

'use strict';

var fs = require('fs');
var gulp = require('gulp');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var color_rgba_fallback = require('postcss-color-rgba-fallback');
var opacity = require('postcss-opacity');
var pseudoelements = require('postcss-pseudoelements');
var vmin = require('postcss-vmin');
var pixrem = require('pixrem');
var will_change = require('postcss-will-change');
var cssnext = require('cssnext');
var notify = require('gulp-notify');
var cssnano = require('gulp-cssnano');
var styleguide = require('postcss-style-guide');
var atImport = require('postcss-import');
var mqpacker = require('css-mqpacker');
var mixins = require('postcss-mixins');
var pCssFor = require('postcss-for');
var simpleVar = require('postcss-simple-vars');
var cssvariables = require('postcss-css-variables');
var pCssEach = require('postcss-each');
var pCssConditionals = require('postcss-conditionals');
var pCssCalc = require('postcss-calc');
var pCssNested = require('postcss-nested');
var sassExtend = require('postcss-sass-extend');
var defineProperty = require('postcss-define-property');
var nestedProps = require('postcss-nested-props');
//Preprocessor
var precss = require('precss');

/**
 *  This will load all js or coffee files in the gulp directory
 *  in order to load all gulp tasks
 */
fs.readdirSync('./gulp').filter(function(file) {
  return (/\.(js|coffee)$/i).test(file);
}).map(function(file) {
  require('./gulp/' + file);
});

gulp.task('css', function() {
  var processors = [
    atImport,
    mqpacker,
    cssnano,
    precss,
    will_change,
    autoprefixer({browsers:'safari >= 9, ie >= 11'}),
    color_rgba_fallback,
    opacity,
    pseudoelements,
    vmin,
    pixrem,
    cssnext,
    precss,
    styleguide({
      project: 'Hello PostCSS!',
      dest: 'styleguide/index.html',
      showCode: false
    })
  ];

  var configNano = {
    discardComments: { removeAll: true },
    calc: {precision:2},
    safe: true
  };

  return gulp.src('./src/app/*.css')
    .pipe(postcss(processors))
    .pipe(gulp.dest('./dest'))
    .pipe(cssnano(configNano))
    .pipe(gulp.dest('./dest/min'))
    .pipe(notify({message: 'Your CSS is ready to rock! =)'}));
});

/* TAREA PARA EL TUTORIAL DE ROLL YOUR OWN PREPROCESSORS */
gulp.task('styles', function () {
  var processors = [
    atImport,
    mixins,
    pCssFor,
    simpleVar({silent: true}),
    cssvariables,
    pCssEach,
    pCssConditionals,
    pCssCalc,
    pCssNested,
    sassExtend,
    defineProperty,
    nestedProps
  ];
  return gulp.src('./src/app/styles/style.css')
    .pipe(postcss(processors))
    .pipe(gulp.dest('./dest'))
    .pipe(notify({message: 'Your CSS is ready to rock! =)'}));
});

/**
 *  Default task clean temporaries directories and launch the
 *  main optimization build task
 */
gulp.task('default', ['clean'], function () {
  gulp.start('css');
});
