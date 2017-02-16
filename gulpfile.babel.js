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
    .pipe(concat.header(`/*
  @license sc-date-time
  @author SimeonC
  @license 2015 MIT
  @version ${pkg.version}
  
  See README.md for requirements and use.
*/\
`,
    ))
    .pipe(gulp.dest('dist'));
});

gulp.task('compile:stylus', ['clean:dist'], () => {
  const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  return gulp.src(['./src/styles.styl'])
    .pipe(stylus())
    .pipe(autoprefixer())
    .pipe(concat())
    .pipe(concat.header(`/*
  @license sc-date-time
  @author SimeonC
  @license 2015 MIT
  @version ${pkg.version}
  
  See README.md for requirements and use.
*/\
`,
    ))
    .pipe(rename('sc-date-time.css'))
    .pipe(gulp.dest('dist'));
});

gulp.task('compile:main', ['compile:javascript', 'compile:stylus']);
gulp.task('compile', ['compile:main'], cb => del(['dist/*.temp'], cb));

/*
  Bumping version number and tagging the repository with it.

  You can use the commands

    gulp prerel    # makes v0.1.0 -> v0.1.1-pre1
    gulp patch    # makes v0.1.0 → v0.1.1
    gulp minor    # makes v0.1.1 → v0.2.0
    gulp major    # makes v0.2.1 → v1.0.0

  To bump the version numbers accordingly after you did a patch,
  introduced a feature or made a backwards-incompatible release.
*/
const releaseVersion = importance =>
  // get all the files to bump version in
  gulp.src(['./package.json'])
    // bump the version number in those files
    .pipe(bump({ type: importance }))
    // save it back to filesystem
    .pipe(gulp.dest('./'))
;
gulp.task('tagversion', () =>
  gulp.src(['./package.json', './changelog.md', './dist/*'])
    // commit the changed version number
    .pipe(git.commit('chore(release): Bump Version Number'))
    // Filter down to only one file
    .pipe(filter('package.json'))
    // **tag it in the repository**
    .pipe(tagVersion()),
);

gulp.task('changelog', cb => {
  const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  return changelog({
    version: pkg.version,
    repository: pkg.repository.url,
  }
  , (err, content) => fs.writeFile('./changelog.md', content, cb));
});

gulp.task('release:prerel', () => releaseVersion('prerelease'));
gulp.task('release:patch', () => releaseVersion('patch'));
gulp.task('release:minor', () => releaseVersion('minor'));
gulp.task('release:major', () => releaseVersion('major'));
gulp.task('prerel', () =>
  runSequence(
    'release:prerel'
    , 'changelog'
    , 'compile'
    , 'tagversion',
  ),
);
gulp.task('patch', () =>
  runSequence(
    'release:patch'
    , 'changelog'
    , 'compile'
    , 'tagversion',
  ),
);
gulp.task('minor', () =>
  runSequence(
    'release:minor'
    , 'changelog'
    , 'compile'
    , 'tagversion',
  ),
);
gulp.task('major', () =>
  runSequence(
    'release:major'
    , 'changelog'
    , 'compile'
    , 'tagversion',
  ),
);

gulp.task('default', ['compile']);
