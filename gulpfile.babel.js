// dependencies
import fs from 'fs';
import gulp from 'gulp';
import git from 'gulp-git';
import bump from 'gulp-bump';
import filter from 'gulp-filter';
import tagVersion from 'gulp-tag-version';
import del from 'del';
import concat from 'gulp-concat-util';
import order from 'gulp-order';
import rename from 'gulp-rename';
import runSequence from 'run-sequence';
import changelog from 'conventional-changelog';

import stylus from 'gulp-stylus';
import autoprefixer from 'gulp-autoprefixer';

import babel from 'gulp-babel';

import jade from 'gulp-jade';
import ngtemplate from 'gulp-ngtemplate';
import htmlmin from 'gulp-htmlmin';

gulp.task('clean:dist', cb => del(['dist/*'], cb));
gulp.task('compile:jade', ['clean:dist'], () =>
  gulp.src(['./src/*.jade'])
    .pipe(jade({ pretty: true }))
    .pipe(rename({ prefix: 'scDateTime-', extname: '.tpl' }))
    .pipe(gulp.dest('dist'))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(ngtemplate({ module: 'scDateTime' }))
    .pipe(rename({ extname: '.tpl.temp' })) // for temp file cleanup
    .pipe(gulp.dest('dist')),
);
gulp.task('compile:babel', ['compile:jade'], () =>
  gulp.src(['./src/main.js'])
    // Lint the coffescript
    .pipe(babel({
      presets: [['env', {
        modules: 'umd',
        targets: {
          browsers: 'last 2 versions',
        },
      }]],
    }))
    .pipe(rename('sc-date-time.js'))
    .pipe(gulp.dest('dist')),
);
gulp.task('compile:javascript', ['compile:babel'], () => {
  const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  return gulp.src(['./dist/sc-date-time.js', './dist/*.tpl.temp'])
    .pipe(order(['dist/sc-date-time.js', 'dist/*.tpl.temp']))
    .pipe(concat('sc-date-time.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('compile:stylus', ['clean:dist'], () => {
  const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  return gulp.src(['./src/styles.styl'])
    .pipe(stylus())
    .pipe(autoprefixer())
    .pipe(concat())
    .pipe(rename('sc-date-time.css'))
    .pipe(gulp.dest('dist'));
});

gulp.task('compile:main', ['compile:javascript', 'compile:stylus']);
gulp.task('compile', ['compile:main'], cb => del(['dist/*.temp'], cb));
gulp.task('default', ['compile']);
