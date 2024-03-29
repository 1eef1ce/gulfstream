'use strict';

// General
const gulp = require('gulp');
const newer = require('gulp-newer');
const multipipe = require('multipipe');
const rename = require('gulp-rename');
const rimraf = require('rimraf');

// Styles
const stylus = require('gulp-stylus');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer-stylus');
const concat = require('gulp-concat');


// BrowserSync
const browserSync = require('browser-sync').create();

// Paths to project folders
const paths = {
    input: 'src/',
    output: 'public/',
    scripts: {
        input: 'src/js/*.js',
        output: 'public/js/',
        watch: 'src/js/**/*.js'
    },
    styles: {
        input: 'src/styles/**/*.styl',
        output: 'public/css/',
        watch: 'src/styles/**/*.*'
    },
    assets: {
        input: 'src/assets/**/*.*',
        output: 'public/assets/',
        watch: 'src/assets/**/*.*'
    },
    html: {
        input: 'src/index.html',
        output: 'public/',
        watch: 'src/**/*.html'
    }
};

// Tasks
gulp.task('styles', function () {
    return multipipe(
        gulp.src(paths.styles.input),
        stylus({compress: false, use:[autoprefixer()]}),
		concat('style.css'),
        gulp.dest(paths.styles.output)
    );
});

gulp.task('scripts', function () {
    return multipipe(
        gulp.src(paths.scripts.input),
        gulp.dest(paths.scripts.output)
    );
});

gulp.task('assets', function(){
    return multipipe(
        gulp.src(paths.assets.input),
        newer(paths.assets.output),
        gulp.dest(paths.assets.output)
    );
});

gulp.task('html', function() {
    return multipipe(
        gulp.src(paths.html.input),
        gulp.dest(paths.html.output)
    );
});

gulp.task('clean', function (callback) {
    return rimraf(paths.output, callback)
});

gulp.task('build', gulp.series(
    'clean',
    gulp.parallel('styles', 'scripts', 'assets', 'html'))
);

gulp.task('watch', function () {
    gulp.watch(paths.styles.watch, gulp.series('styles'));
    gulp.watch(paths.scripts.watch, gulp.series('scripts'));
    gulp.watch(paths.assets.watch, gulp.series('assets'));
    gulp.watch(paths.html.watch, gulp.series('html'));
});

gulp.task('serve', function () {
    browserSync.init({
        server: 'public'
    });
    browserSync.watch('public/**/*.*').on('change', browserSync.reload);
});

gulp.task('dev',
    gulp.series('build',
        gulp.parallel('watch', 'serve'))
);

// Default task
gulp.task('default',
    gulp.series ('build', 'serve'));
