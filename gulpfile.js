var gulp = require('gulp');
    imagemin = require('gulp-imagemin');
    clean = require('gulp-clean');
    concat = require('gulp-concat');
    htmlreplace = require('gulp-html-replace');
    uglify = require('gulp-uglify');
    browserSync = require('browser-sync');
    jshint = require("gulp-jshint");
    jshintStylish = require('jshint-stylish');
    scsslint = require('gulp-scss-lint');
    autoprefixer = require('gulp-autoprefixer');
    sass = require('gulp-sass');
    sourcemaps = require('gulp-sourcemaps');
 	notify = require('gulp-notify');
 	cache = require('gulp-cache');
	rename = require('gulp-rename');
	minifycss = require('gulp-minify-css'),
	minifyhtml= require('gulp-minify-html'); 


gulp.task('default', ['clean'], function(){

    gulp.start('server');
    gulp.watch('src/scss/**/*.scss', ['styles']);
    gulp.watch('src/js/**/*.js', ['scripts']);
	gulp.watch('src/libs/**/*.css', ['scripts-libs']);
    gulp.watch('src/img/**/*.img', ['images']);
    gulp.watch('src/**/*.html', ['html']);
    gulp.watch('src/**/*').on('change', browserSync.reload);
});

gulp.task('clean', function() {
    return gulp.src('dist')
        .pipe(clean());
});

gulp.task('server', ['images','styles','styles-libs','scripts','html'], function() {
	browserSync.init({
		server: {
			baseDir: 'dist'
		}
	});
});

gulp.task('scss-lint', function() {
    return gulp.src('/scss/*.scss')
    	.pipe(scsslint())
    	.pipe(gulp.dest('dist/css') );
});

gulp.task('hint-js', function (event) {
 	return gulp.src('src/js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(jshintStylish));
});

gulp.task('html', function() {
    return gulp.src('src/**/*.html')
    .pipe(minifyhtml())
    .pipe(gulp.dest('dist'));
});

gulp.task('scripts', function() {
    return gulp.src(['src/js/new-age.js'])
	    .pipe(concat('main.js'))	    
        .pipe(rename({ suffix: '.min' }))
	    .pipe(uglify())
	    .pipe(gulp.dest('dist/js'));
});

gulp.task('images', function() {
    return gulp.src('src/img/**/*')
        .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('styles', function () {
    return gulp.src('src/scss/**/*.scss')
	 	.pipe(sourcemaps.init())
	 	.pipe(sass().on('error', sass.logError))
	 	.pipe(concat('main.css'))
	 	.pipe(rename({ suffix: '.min' }))
	 	.pipe(autoprefixer('last 2 version'))
	 	.pipe(minifycss())
	 	.pipe(sourcemaps.write())
	 	.pipe(gulp.dest('dist/css'));
});

gulp.task('styles-libs', function () {
    return gulp.src(['src/vendor/bootstrap/css/bootstrap.min.css'])
        .pipe(concat('main-external.css'))
	 	.pipe(rename({ suffix: '.min' }))
	 	.pipe(minifycss())
	 	.pipe(gulp.dest('dist/css'));
});


