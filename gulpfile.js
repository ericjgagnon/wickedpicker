/**
 * Created by ericgagnon on 7/1/15.
 */
var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function () {
    gulp.src('./sass/master.scss')
        .pipe(sass({
            includePaths: require('node-bourbon').includePaths
        })).pipe(gulp.dest('./stylesheets'));
});

gulp.task('default', ['watch']);

gulp.task('watch', function () {
    gulp.watch('./sass/**/*.scss', ['sass']);
});
