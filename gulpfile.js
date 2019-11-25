const {src, dest, series, parallel, watch} = require('gulp');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const browsersync = require('browser-sync').create();
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const del = require('del');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');

const SCSS_PATH = 'src/scss';
const HTML_PATH = 'src/index.html';
const DIST_PATH = 'docs';

function css() {
  return src([
    './node_modules/normalize.css/normalize.css',
    `${SCSS_PATH}/**/*.scss`,
  ])
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(concat('style.css'))
    .pipe(sourcemaps.write())
    .pipe(dest(DIST_PATH))
    .pipe(browsersync.stream());
}

function watchScss() {
  return watch(`${SCSS_PATH}/**/*.scss`, css);
}

function html() {
  return src(HTML_PATH).pipe(dest(DIST_PATH));
}

function watchHtml() {
  return watch(HTML_PATH, html)
    .on('change', browsersync.reload)
}


function serve() {
 return browsersync.init({
    server: DIST_PATH,
    browser: '/usr/bin/google-chrome-stable',
  });
}

function clean() {
  return del(DIST_PATH);
}

exports.default = series(clean, html, css, 
  parallel(watchHtml, watchScss, serve))
