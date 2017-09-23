var gulp = require('gulp');
var jshint = require('gulp-jshint');

gulp.task('lint', function() {
  return gulp.src(['src/*.js', 'src/static/js/*.js', '!src/static/js/socket.io.js', '!src/static/js/pixi.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('default', ['lint']);
