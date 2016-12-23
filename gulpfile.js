const gulp    = require('gulp');
const replace = require('gulp-replace');

var productionUrl       = 'https://SETURLHERE.herokuapp.com';
var webpackDevServerUrl = 'http://localhost:8080';
var devUrl              = 'http://localhost:5000';

// Example
// gulp.task('t', function(){
//   gulp.src(['./lib/phantomPageLoader.js'], {base: './'})
//     .pipe(replace('http://localhost:8080/', '/js/'))
//     .pipe(gulp.dest('./'));
// });

gulp.task('production-js-1', function(){
    var filenames = [
        './views/index.ejs'
    ];
    filenames.forEach( function (name) {
        gulp.src([name], {base: './'})
            .pipe(replace( webpackDevServerUrl + '/app.js', '/js/app.js'))
            .pipe(gulp.dest('./'));
    });
});

gulp.task('dev-js-1', function(){
    var filenames = [
        './views/index.ejs'
    ];
    filenames.forEach( function (name) {
        gulp.src([name], {base: './'})
            .pipe(replace('/js/app.js', webpackDevServerUrl + '/app.js'))
            .pipe(gulp.dest('./'));
    });
});


gulp.task('production', ['production-js-1'], function () {
    console.log('Asset paths ready for production');
})

gulp.task('dev', ['dev-js-1'], function () {
    console.log('Asset paths ready for development');
})

gulp.task('default', function() {
  // place code for your default task here
  console.log("Use 'npm run gulp production' to prepare for deploy.");
  console.log("Use 'npm run gulp dev' to prepare for development.");
});
