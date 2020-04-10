/**
 * Import all required node modules
 */
var fs = require('fs')
var gulp = require('gulp')
var concat = require('gulp-concat')
var cleanCSS = require('gulp-clean-css')
const shell = require('gulp-shell')
var uglify = require('gulp-uglify')

/**
 * Concatenate, minify and copy Css
 * src/css/* -> build/css/style.min.css
 */
gulp.task('copy-css', () => {
	return gulp.src('src/css/*')
		.pipe(concat('style.min.css'))
		.pipe(cleanCSS())
		.pipe(gulp.dest('build/css/'))
})

/**
 * Compile and bundle Marko files
 * src/marko/app.marko -> src/js/marko.js
 */
if (process.platform === 'win32') {
	gulp.task('compile-marko', shell.task('webpack.cmd --config webpack.config.js'))
} else {
	gulp.task('compile-marko', shell.task('./node_modules/.bin/webpack --config webpack.config.js'))
}

/**
 * Concatenate, uglify and copy Js
 * src/js/* -> build/js/bundle.min.js
 */
gulp.task('copy-js', () => {
	return gulp.src('src/js/**/*.js')
		.pipe(concat('scripts.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('build/js/'))
})

/**
 * Copy nw Js-Files
 * src/*.js -> build/*
 */
gulp.task('copy-electron-js', () => {
	return gulp.src('src/main/*.js')
    .pipe(concat('index.js'))
		.pipe(gulp.dest('build/'))
})

/**
 * Copy Html
 * src/*.html -> build/*.html
 */
gulp.task('copy-html', () => {
	return gulp.src('src/*.html')
		.pipe(gulp.dest('build/'))
})

/**
 * Copy Assets
 * src/assets/** -> build/assets/**
 */
gulp.task('copy-assets', () => {
	return gulp.src('src/assets/**/*')
		.pipe(gulp.dest('build/assets/'))
})

/**
 * Ecex compile tasks
 */
gulp.task('compile', gulp.parallel('compile-marko'))

/**
 * Ecex copy tasks
 */
gulp.task('copy', gulp.parallel('copy-css', 'copy-js', 'copy-electron-js', 'copy-html', 'copy-assets'))

/**
 * Compile App to /build
 */
gulp.task('build', gulp.series('compile', 'copy'))

/**
 * Set Electron to development mode
 */
gulp.task('set-env:development', done => {
	process.env.NODE_ENV = 'development'
	done()
})

/**
 * Set Electron to production mode
 */
gulp.task('set-env:production', done => {
	process.env.NODE_ENV = 'production'
	done()
})

/**
 * Start NW
 */
gulp.task('start-electron', shell.task('electron .'))

/**
 * Package App to /release
 */
if (process.platform === 'win32') {
	var packageInfo = JSON.parse(fs.readFileSync('./package.json'))
}

//gulp.task('release', gulp.series('build', 'set-env:production', gulp.parallel('package-mac', 'package-windows', 'package-linux'), 'set-env:development'))

/**
 * Add watch task for Sass/Scss, Jsx and Js Files
 */
gulp.task('watch', done => {
	gulp.watch('src/assets/**/*', gulp.series('copy-assets'))
	gulp.watch('src/components/**/*', gulp.series('compile-marko'))
	gulp.watch('src/views/**/*', gulp.series('compile-marko'))
	gulp.watch('src/models/**/*', gulp.series('compile-marko'))
	gulp.watch('src/schemata/**/*', gulp.series('compile-marko'))
	gulp.watch('src/css/*.css', gulp.series('copy-css'))
	gulp.watch('src/js/**/*.js', gulp.series('compile-marko'))
	gulp.watch('src/*.html', gulp.series('copy-html'))
	gulp.watch('src/*.js', gulp.series('copy-electron-js'))
	gulp.watch('client.js', gulp.series('compile-marko', 'copy-js'))
	done()
})

/**
 * Serve App for development
 */
gulp.task('start', gulp.series('build', 'set-env:development', 'start-electron'))
gulp.task('watch-and-start', gulp.series('build', 'watch', 'set-env:development', 'start-electron'))
