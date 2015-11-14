var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');

gulp.task('styles', function () {
  return gulp.src('src/index.css')
    .pipe(autoprefixer({ browsers: ['> 2%'] }))
    .pipe(minifyCSS())
    .pipe(gulp.dest('dist/'));
});

gulp.task('default', ['styles']);