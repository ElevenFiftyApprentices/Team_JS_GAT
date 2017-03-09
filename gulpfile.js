var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var watch = require('gulp-watch');

var javascriptFiles = [
	// './shoppinglist-config.js',
	// './shoppinglist-service.js',
	// './shoppinglist-controller.js',
	// './home-controller.js'
];

gulp.task('bundle', function() {
	return gulp.src(javascriptFiles)
		.pipe(sourcemaps.init())
		.pipe(concat('bundle.js')) // squash files together into bundle.js
		.pipe(uglify())
		.pipe(sourcemaps.write('./maps/'))
		.pipe(gulp.dest('./dist'));// save into /dist folder
});

gulp.task('watch', function(){
	gulp.watch(javascriptFiles, ['bundle']);
});

gulp.task('default', ['bundle', 'watch']);