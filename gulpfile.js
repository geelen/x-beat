var gulp = require('gulp'),
  es6ify = require('es6ify'),
  $ = require('gulp-load-plugins')();

gulp.task('js', function () {
  return gulp.src('src/x-beat.js')
    .pipe($.browserify({
      add: [ es6ify.runtime ],
      transform: ['es6ify']
    }))
//    .pipe($.uglify())
    .pipe(gulp.dest('build'));
});

gulp.task('vulcan', ['js'], function () {
  return gulp.src('src/x-beat.html')
    .pipe(gulp.dest('build'))
    .pipe($.vulcanize({dest: 'dist/x-beat', inline: true}))
    .pipe(gulp.dest('dist/x-beat'));
})

gulp.task('jade', function () {
  return gulp.src(['src/examples/**/*.jade', '!src/examples/**/_*.jade'])
    .pipe($.jade({pretty: true}))
    .pipe(gulp.dest('dist'))
});

gulp.task('assets', function () {
  return gulp.src('src/examples/assets/**')
    .pipe(gulp.dest('dist/assets'))
});

gulp.task('build', ['vulcan', 'jade', 'assets'], function () {
});

gulp.task('clean', function () {
  return gulp.src(['x-beat.html', 'build', 'dist'], {read: false})
    .pipe($.clean())
})

gulp.task('default', ['build', 'server'], function () {
  gulp.watch(['src/x-beat.html', 'src/**/*.js', 'src/*.scss'], ['vulcan']);
  gulp.watch(['src/examples/**/*.jade'], ['jade']);
  gulp.watch(['src/examples/assets/**'], ['assets']);
});

gulp.task('server', function () {
  gulp.src('dist')
    .pipe($.webserver({
      port: 1983,
      livereload: {port: 2983, enable: true}
    }))
});
