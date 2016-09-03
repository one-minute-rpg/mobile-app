var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var babel = require('gulp-babel');
var del = require('del');
var ejs = require("gulp-ejs");

var paths = {
    sass: [
        './app/app.scss',
        './app/styles/**/*.scss',
        './app/components/shared/**/*.scss',
        './app/components/pages/**/*.scss'
    ],
    js: [
        './app/**/*.js',
        '!./app/lib/**/*.*'
    ],
    vendorJs: [
        './app/lib/ionic/js/ionic.bundle.min.js'
    ],
    vendorCss: [
        './app/lib/ionic/css/ionic.min.css',
        './app/lib/animatecss/animate.css'
    ],
    vendorPack: [
        './app/lib/rpg-awesome/**/*.*'
    ],
    ejs: [
        './app/**/*.ejs'
    ],
    resources: [
        './app/resources/**/*.*'
    ]
};

var watch = {
    sass: ['./app/**/*.scss'],
    js: paths.js,
    ejs: ['./app/**/*.ejs']
};



gulp.task('sass', function (done) {
    gulp.src(paths.sass)
        .pipe(sass())
        .on('error', sass.logError)
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(concat('app.bundle.css'))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest('./www/css/'))
        .on('end', done);
});

gulp.task('js', function (done) {
    return gulp.src(paths.js)
        .pipe(concat('app.bundle.js'))
        .pipe(gulp.dest('./www'));
});

gulp.task('vendor:js', function (done) {
    return gulp.src(paths.vendorJs)
        .pipe(concat('vendor.bundle.js'))
        .pipe(gulp.dest('./www/js'));
});

gulp.task('vendor:css', function (done) {
    return gulp.src(paths.vendorCss)
        .pipe(concat('vendor.bundle.css'))
        .pipe(gulp.dest('./www/css'));
});

gulp.task('vendor:pack', function (done) {
    return gulp.src(paths.vendorPack, { base: './app/lib/' })
        .pipe(gulp.dest('./www/vendor-pack'));
});

gulp.task('ejs', function () {
    gulp.src(paths.ejs)
        .pipe(ejs(
            { msg: 'Hello Gulp!' }, { ext: '.html' })
        .on('error', gutil.log))
        .pipe(gulp.dest('./www'));
});

gulp.task('resources', function () {
    gulp.src(paths.resources)
        .pipe(gulp.dest('./www/resources'));
});

gulp.task('watch', function () {
    gulp.watch(watch.sass, ['sass']);
    gulp.watch(watch.js, ['js']);
    gulp.watch(watch.ejs, ['ejs']);
});

gulp.task('build', ['sass', 'js', 'ejs', 'vendor:js', 'vendor:css', 'vendor:pack', 'resources'], function (done) {
    done();
})

gulp.task('clean', function () {
    return del('www/**');
});
