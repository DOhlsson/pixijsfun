var gulp = require('gulp'),
    spawn = require('child_process').spawn,
    node;
var jshint = require('gulp-jshint');

var sources = ['src/*.js', 'src/static/js/*.js', '!src/static/js/socket.io.js', '!src/static/js/pixi.js'];

gulp.task('server', function() {
  if (node) node.kill();
  node = spawn('node', ['src/index.js'], {stdio: 'inherit'});
  node.on('close', function (code) {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  });
});

gulp.task('lint', function() {
  return gulp.src(sources)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('watch', function() {
  gulp.watch(sources, ['lint', 'server']);
});

process.on('exit', function() {
  if (node) node.kill();
});

gulp.task('default', ['lint', 'watch', 'server']);
