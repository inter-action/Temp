var gulp = require('gulp');
var gulpWebpack = require("webpack-stream");

var webpack_config = require('../webpack.config.js');


gulp.task("webpack", function() {
    return gulp.src('src/cate_container.js')
    .pipe(gulpWebpack(webpack_config))
    .pipe(gulp.dest('dist/'));
});
