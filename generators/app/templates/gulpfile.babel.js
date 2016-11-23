'use strict';

import path from "path";
import gulp from "gulp";
import del from "del";
import pump from 'pump';
import runSequence from "run-sequence";
import browserSync from "browser-sync";
import gulpLoadPlugins from "gulp-load-plugins";
import browserify from "browserify";
import watchify from "watchify";
import babelify from "babelify";
import source from "vinyl-source-stream";
import buffer from "vinyl-buffer";
import assign from "lodash.assign";
import pkg from "./package";

const ALL = path.join("**", "*.*");

const BUILD = path.join(__dirname, "build");
const BUILD_JS = path.join(BUILD, "js");
const BUILD_CSS = path.join(BUILD, "css");

const TMP = path.join(__dirname, ".tmp");
const TMP_JS = path.join(TMP, "js");
const TMP_CSS = path.join(TMP, "css");

const SRC = path.join(__dirname, "src");
const SRC_JS = path.join(SRC, "js");
const SRC_HTML = path.join(SRC, "html");
const SRC_SASS = path.join(SRC, "sass");
const SRC_STATIC = path.join(SRC, "static");

const $ = gulpLoadPlugins();
const RELOAD = browserSync.reload;


//CLEAN
gulp.task('clean', () => del([BUILD, TMP], {dot: true}));

gulp.task('clean:html', () => del(BUILD_HTML));

gulp.task('clean:js', () => del([BUILD_JS, TMP_JS]));

gulp.task('clean:css', () => del([BUILD_CSS, TMP_CSS]));


//LINT
gulp.task('lint', () =>
  gulp.src(path.join(SRC_JS, ALL))
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failOnError()))
);


//BUILD
gulp.task('build:static', () =>
  gulp.src(path.join(SRC_STATIC, ALL))
    .pipe(gulp.dest(BUILD))
    .pipe($.size({title: 'build:static', showFiles: true}))
);

gulp.task('build:html', () =>
  gulp.src(path.join(SRC_HTML, 'index.html'))
    .pipe($.htmlReplace({
      'title': pkg.name,
      'css': path.join('css', 'styles.css'),
      'js': path.join('js', 'app.js')
    }))
    .pipe($.htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeRedundantAttributes: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      removeOptionalTags: true
    }))
    .pipe(gulp.dest(BUILD))
    .pipe($.size({title: 'build:html', showFiles: true}))
);

let customOpts = {
  entries: [path.join(SRC_JS, "main.js")],
  debug: true,
};
let opts = assign({}, watchify.args, customOpts);
let b = watchify(browserify(opts));
b.transform(babelify, {presets: ["es2015"]});

function bundle() {
  return pump([
      b.bundle(),
      source('app.js'),
      buffer(),
      $.sourcemaps.init({loadMaps: true}),
      // $.sourcemaps.write(),
      // gulp.dest(TMP_JS),
      // source('app.min.js'),
      $.uglify(),
      $.sourcemaps.write('./'),
      gulp.dest(BUILD_JS),
      $.size({title: 'build:js', showFiles: true})
    ]);
}

gulp.task('build:js', bundle);
b.on('update', bundle);

gulp.task('build:css', () => {
  const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ];

  return gulp.src(path.join(SRC_SASS, 'styles.scss'))
    .pipe($.newer(TMP_CSS))
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      precision: 10
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(gulp.dest(TMP_CSS))
    // Concatenate and minify styles
    .pipe($.if('*.css', $.cssnano()))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(BUILD_CSS))
    .pipe($.size({title: 'build:css', showFiles: true}));

});

gulp.task('build', cb => runSequence('clean', ['build:static', 'build:html', 'build:css', 'build:js'], cb));


//SERVE
gulp.task('serve', ['build'], () => {
  browserSync({
    server: {
      baseDir: BUILD
    },
    reloadDebounce: 2000,
    notify: false
  });
  gulp.watch(path.join(SRC_SASS, ALL), ['clean:css', 'build:css']).on('change', RELOAD);
  gulp.watch(path.join(SRC_HTML, ALL), ['clean:html', 'build:html']).on('change', RELOAD);
  gulp.watch(path.join(SRC_JS, ALL), ['clean:js', 'build:js']).on('change', RELOAD);
});


gulp.task('default', () =>
  console.log('Useage is as follows with one or more of the configured tasks:\n' +
    '$ gulp <task> [<task2> ...] \n' +
    'available options:\n' +
    '\t* clean - cleans the built project\n' +
    '\t* build - build the project\n' +
    '\t* serve - cleans, builds and serves the project, watching for any changes')
);
