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
	cache = require('gulp-cache');
	rename = require('gulp-rename');
	minifycss = require('gulp-minify-css'),
	minifyhtml= require('gulp-minify-html'); 
	usemin = require('gulp-usemin');

// Development Tasks 
// -----------------

gulp.task('default', ['sass'],function(){

	gulp.start('server');
	gulp.watch('src/scss/**/*.scss', ['sass']);
	gulp.watch('src/**/*.html', browserSync.reload);
	gulp.watch('src/js/**/*.js', browserSync.reload);

	});

gulp.task('sass', function() {
	return gulp.src('src/scss/**/*.scss')
	.pipe(sourcemaps.init())
	.pipe(sass().on('error', sass.logError))
	.pipe(autoprefixer('last 2 version'))
	.pipe(sourcemaps.write())
	.pipe(gulp.dest('src/css'))
	.pipe(browserSync.reload({
		stream: true
		}));
	})

gulp.task('server', function() {
	browserSync.init({
		server: {
			baseDir: 'src'
		}
		});
	});

//Quality codes
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


// Optimization Tasks 
// ------------------

gulp.task('build', ['clean'],function() {
	gulp.start('usemin','images','fonts');
	});


gulp.task('clean', function() {
	return gulp.src('dist')
	.pipe(clean());
	});

// Optimizing CSS and JavaScript 
gulp.task('usemin', ['sass'], function() {

	return gulp.src('src/**/*.html')
	.pipe(usemin({
		css:[minifycss],
		csslibs:[],
		js:[uglify],
		jslibs:[]
		}))
	.pipe(gulp.dest('dist'));
	});

// Optimizing Images 
gulp.task('images', function() {
	return gulp.src('src/img/**/*')
	.pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
	.pipe(gulp.dest('dist/img'));
	});

// Copying fonts 
gulp.task('fonts', function() {
	return gulp.src('src/fonts/**/*')
	.pipe(gulp.dest('dist/fonts'))
	})