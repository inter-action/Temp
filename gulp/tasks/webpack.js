var gulp = require('gulp');
var webpack = require("webpack-stream");

gulp.task("webpack", function() {
    return gulp.src('src/entry.js')
    .pipe(webpack())
    .pipe(gulp.dest('dist/'));
});
