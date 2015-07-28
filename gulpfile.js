/**
 * Created by ericgagnon on 7/1/15.
 */
var gulp = require('gulp');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-minify-css');
var rename = require('gulp-rename');

var uglify = require('gulp-uglify');

gulp.task('sass', function () {
    gulp.src('./sass/wickedpicker.scss')
        .pipe(sass({
            includePaths: require('node-bourbon').includePaths
        })).pipe(gulp.dest('./stylesheets'))
        .pipe(minifyCSS())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist'));
});

gulp.task('uglify', function () {
    return gulp.src('src/*.js')
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['watch']);

gulp.task('watch', function () {
    gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task('compress', ['uglify', 'sass']);