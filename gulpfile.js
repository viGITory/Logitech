'use strict';

const {src, dest, parallel, series, watch} = require('gulp');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const less = require('gulp-less');
const autoprefixer = require('gulp-autoprefixer');
const cssbeautify = require('gulp-cssbeautify');

function browsersync() {
  browserSync.init({
    server: { baseDir: 'docs/' },
    notify: false,
    online: true
  });
}

function startWatch() {
  watch('app/**/*.pug', pugToHtml);
  watch('app/**/*.less', lessToCss);
  watch('docs/*.html').on('change', browserSync.reload);
}

function pugToHtml() {
  return src('app/pages/*.pug')
  .pipe(pug({
    pretty: true
  }))
  .pipe(dest('docs/'))
}

function lessToCss() {
  return src('app/styles/styles.less')
  .pipe(eval('less')())
  .pipe(cssbeautify({
    indent: '  ',
    autosemicolon: true
  }))
  .pipe(autoprefixer({
    overrideBrowserslist: ['last 5 versions'],
    cascade: true
  }))
  .pipe(dest('docs/'))
  .pipe(browserSync.stream());
}

exports.pugToHtml = pugToHtml;
exports.lessToCss = lessToCss;
exports.default = parallel(browsersync, startWatch);
