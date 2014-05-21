var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    minifyCSS = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    size = require('gulp-size'),
    notify = require('gulp-notify'),
    pkg = require('./package.json');

var paths = {
  styles: './css/style.scss',
  scripts: ['./js/main.js']
};

gulp.task('styles', ['components'], function () {
  gulp.src(paths.styles)
    .pipe(sass({ style: 'expanded' })) // Add source maps after figuring out minify issue
    .pipe(gulp.dest('./css/'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifyCSS())
    .pipe(size())
    .pipe(gulp.dest('./css/'))
    .pipe(notify({ message: 'Styles task complete.' }));
});

gulp.task('components', function() {
  return gulp.src(['./bower_components/normalize.css/normalize.css'])
  .pipe(rename('_normalize.scss'))
  .pipe(gulp.dest('./bower_components/normalize.css/'));
});

gulp.task('scripts', ['lint'], function() {
  gulp.src(paths.scripts)
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./js/'))
    .pipe(rename('app.min.js'))
    .pipe(uglify({ preserveComments: 'some' }))
    .pipe(size())
    .pipe(gulp.dest('./js/'))
    .pipe(notify({ message: 'Scripts task complete.' }));
});

gulp.task('lint', function () {
  return gulp.src('./js/main.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch('./js/*.js', ['scripts']);
  gulp.watch('./*.scss', ['styles']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['styles', 'scripts']);
