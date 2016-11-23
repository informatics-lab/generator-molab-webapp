'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');
var del = require('del');
var htmlmin = require('gulp-htmlmin');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync').create();
var pump = require('pump');
var rollup = require('gulp-rollup');
var babel = require('rollup-plugin-babel');
var htmlReplace = require('gulp-html-replace');
var rename = require('gulp-rename');
var mocha = require('gulp-mocha');

const PACKAGE_JSON = require('./package');
const BUILD_DEST = "./build";


//CLEAN
gulp.task('clean', function () {
  return del([BUILD_DEST]);
});
gulp.task('clean:html', function () {
  return del([BUILD_DEST + "/*.html"]);
});
gulp.task('clean:js', function () {
  return del([BUILD_DEST + "/js/*.*"]);
});
gulp.task('clean:css', function () {
  return del([BUILD_DEST + "/css/**/*.*"]);
});


//BUILD
gulp.task('build:static', function () {
  gulp.src('./src/static/**/*')
    .pipe(gulp.dest(BUILD_DEST));
});
gulp.task('build:html', ['clean:html'], function () {

  gulp.src('./src/html/*.html')
    .pipe(htmlReplace({
      'title': PACKAGE_JSON.name,
      'css': 'css/styles.css',
      'js': 'js/app.min.js'
    }))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(BUILD_DEST));
});
gulp.task('build:js', ['clean:js'], function (cb) {
  pump([
      gulp.src('./src/js/**/*.js'),
      sourcemaps.init({loadMaps: true}),
      rollup({
        entry: './src/js/main.js',
        plugins: [
          babel({
            exclude: 'node_modules/**'
          })
        ]
      }),
      rename('app.min.js'),
      uglify(),
      sourcemaps.write('./'),
      gulp.dest(BUILD_DEST + '/js/')
    ],
    cb);
});
gulp.task('build:css', ['clean:css'], function () {
  gulp.src('./src/sass/styles.scss')
    .pipe(sass({outputStyle: 'compressed'}))        //minified
    .pipe(sass())
    .pipe(gulp.dest(BUILD_DEST + '/css'));
});

gulp.task('build', function (cb) {
  runSequence('test', 'clean', ['build:static', 'build:html', 'build:css', 'build:js'], cb);
});


//SERVE
gulp.task('serve', ['watch'], function () {
  browserSync.init({
    server: {
      baseDir: BUILD_DEST
    },
    reloadDebounce: 2000,
    notify: false
  });
});


//WATCH
gulp.task('watch:css', function () {
  gulp.watch('./src/sass/**/*', ['clean:css', 'build:css']).on('change', browserSync.reload);
});
gulp.task('watch:js', function () {
  gulp.watch('./src/js/**/*', ['clean:js', 'build:js']).on('change', browserSync.reload);
});
gulp.task('watch:html', function () {
  gulp.watch('./src/html/**/*', ['clean:html', 'build:html']).on('change', browserSync.reload);
});
gulp.task('watch', function (cb) {
  runSequence('build', ['watch:html', 'watch:css', 'watch:js'], cb);
});

//TEST
gulp.task('test', () => 
    gulp.src('./test/test.js', {read: false})
        .pipe(mocha({reporter: 'spec'}))
);


gulp.task('default', function () {
  console.log('Useage is as follows with one or more of the configured tasks:\n' +
    '$ gulp <task> [<task2> ...] \n' +
    'available options:\n' +
    '\t* clean - cleans the built project\n' +
    '\t\t-clean:html - cleans just the html\n' +
    '\t\t-clean:css - cleans just the css\n' +
    '\t\t-clean:js - cleans just the js\n' +
    '\t* build - build the project\n' +
    '\t\t-build:html - builds just the html\n' +
    '\t\t-build:css - builds just the css\n' +
    '\t\t-build:js - builds just the js\n' +
    '\t* serve - cleans, builds, watches and serves the project');
});
