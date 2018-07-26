'use strict';

var syntax        = 'scss'; // Syntax: sass or scss;

var theme         = 'mytheme'; // Theme name

var gulp          = require('gulp'),
		gutil         = require('gulp-util' ),
		sass          = require('gulp-sass'),
		babel 				= require('gulp-babel'),
		concat        = require('gulp-concat'),
		uglify        = require('gulp-uglify'),
		cleancss      = require('gulp-clean-css'),
		rename        = require('gulp-rename'),
		autoprefixer  = require('gulp-autoprefixer'),
		notify        = require("gulp-notify"),
		rsync         = require('gulp-rsync'),
		livereload 		= require('gulp-livereload'),
		imagemin 			= require('gulp-imagemin'),
    sourcePath 		= './src/',
    buildPath 		= './app/content/' + theme + '/mytheme/build/';

		gulp.task('styles', function() {
			return gulp.src(sourcePath + syntax + '/**/*.' + syntax)
			.pipe(sass({ outputStyle: 'expand' }).on("error", notify.onError()))
			.pipe(rename({ suffix: '.min', prefix : '' }))
			.pipe(autoprefixer(['last 15 versions']))
			.pipe(cleancss( {level: { 1: { specialComments: 0 } } }))
			.pipe(gulp.dest(buildPath + 'css'))
			.pipe(livereload());
		});
		
		gulp.task('js-libs', function() {
			return gulp.src([
				'node_modules/jquery/dist/jquery.js'
			])
			.pipe(concat('libs.min.js'))
			.pipe(uglify())
			.pipe(gulp.dest(buildPath + 'js'))
			.pipe(livereload());
		});

		gulp.task('js', function() {
			return gulp.src(sourcePath + 'js/common.js')
			.pipe(babel({
				presets: ['env', 'es2015']
			}))
			.pipe(concat('main.min.js'))
			.pipe(uglify())
			.pipe(gulp.dest(buildPath + 'js'))
			.pipe(livereload());
		});

		gulp.task('font', function() {
			gulp.src(sourcePath + 'fonts/**/*.{eot,ttf,woff,woff2,svg}')
				.pipe(gulp.dest(buildPath + 'fonts'))
		 
		});

		gulp.task('img', function() {
			gulp.src(sourcePath + '*.{png,jpg,gif}')
				.pipe(imagemin({
					optimizationLevel: 7,
					progressive: true
				}))
				.pipe(gulp.dest(buildPath + 'img'))
		 
		});
		
		gulp.task('rsync', function() {
			return gulp.src('app/**')
			.pipe(rsync({
				root: 'app/',
				hostname: 'username@yousite.com',
				destination: 'yousite/public_html/',
				// include: ['*.htaccess'], // Includes files to deploy
				exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Excludes files from deploy
				recursive: true,
				archive: true,
				silent: false,
				compress: true
			}))
		});
		
		gulp.task('watch', ['styles', 'js', 'js-libs', 'font', 'img'], function() {
			livereload.listen();
			gulp.watch(sourcePath + syntax + '/**/*.' + syntax, ['styles']);
			gulp.watch([sourcePath + 'js/*.js'], ['js']);
			gulp.watch(sourcePath + 'fonts/**/*.{eot,ttf,woff,woff2,svg}', ['font']);
			gulp.watch(sourcePath + '*.{png,jpg,gif}', ['img']);
		});
		
		gulp.task('default', ['watch']);