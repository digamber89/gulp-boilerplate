/*
	This is a learner template , intended to be very easy to use
	Only two simple tasks are done right now
	1) Take .scss file from assets/style.scss can be changed via var stylesSource. Compile it, generate sourcemap and generate a non-minified and minified version and save it in css folder in the root of the project
	2) Take .js files located in .assets/js/vendor and .assets/js/custom and 
		i) concat (join) all js files
		ii) minify them (see note for problems with minification)
		iii) save them to /js/ folder in the root of the file
*/

/*
To Do List
	1. Error Handling on Minification
		Currently if there is error on javascript file it causes script to not compile
		and also ends process. Maybe Good Idea to use jshint to process this first
	2. Browser Sync
		Currently browser sync is very slow. And not useful for use in development.
		All online blogs says its a good tool but I am not sure right now
*/

var gulp 			= require('gulp');
var sass 			= require('gulp-sass'); // compiles SASS to CSS
var sourcemaps 		= require('gulp-sourcemaps'); // generate css source maps
var notify 		 	= require('gulp-notify'); // provides notification to use once task is complete
var uglify 			= require('gulp-uglify'); // minifies js files
var uglifycss    	= require('gulp-uglifycss'); // minifies css files
var concat       	= require('gulp-concat');  //concatenates multiple js files 
var rename       	= require('gulp-rename'); // Renames files E.g. style.css -> style.min.css


var stylesSource 			 = './assets/css/style.scss';
var jsVendorSource 			 = './assets/js/vendor/*.js';
var jsVendorDestination      = './js';
var jsVendorFile 			 = 'vendor';

var jsCustomSource 			 = './assets/js/custom/*.js';
var jsCustomDestination 	 = './js';
var jsCustomFile	 		 = 'main';


/*
	takes style.scss ,
	generates sourcemap
	generates css and put it css folder in route
*/
gulp.task('compileStyles', function(){
	return gulp.src(stylesSource)
			.pipe(sourcemaps.init())
			.pipe(sass().on('error',sass.logError))
			.pipe(sourcemaps.write('./maps'))
			.pipe(gulp.dest('./css'))
			.pipe(uglifycss({
      				"maxLineLen": 80,
      				"uglyComments": true
    		}))
    		.pipe( rename( { suffix: '.min' } ) )
    		.pipe(gulp.dest('./css'))
			.pipe( notify( { message: 'TASK: "styles" Completed! 💯', onLast: true } ) );
});

/*Compile Files in js/vendor intended for vendor scripts example bootstrap, meanmenu, etc*/
gulp.task('compileVendorJS', function(){
/*This Needs Replacing, Currently do not like how minification of javascript is disturbing workflow*/
	 function createErrorHandler(name) {
	    return function (err) {
	      console.error('Error from ' + name + ' in compress task', err.toString());
	    };
  	 }

	return gulp.src(jsVendorSource)
		   .pipe( concat( jsVendorFile + '.js' )  )
		   .pipe( gulp.dest( jsVendorDestination ) )
		   .pipe( rename( {
       			basename: jsVendorFile,
       			suffix: '.min'
    	 	}))
		   .pipe( uglify().on('error', createErrorHandler('uglify')) )
		   .pipe( gulp.dest( jsVendorDestination ) )
		   .pipe( notify( { message: 'TASK: "compileVendorJS" Completed! 💯', onLast: true } ) );
});


/*Compile Files in Custom JS intended for non-vendor scripts*/
gulp.task('compileCustomJS', function(){
/*This Needs Replacing, Currently do not like how minification of javascript is disturbing workflow*/
	 function createErrorHandler(name) {
	    return function (err) {
	      console.error('Error from ' + name + ' in compress task', err.toString());
	    };
  	 }

	return gulp.src(jsCustomSource)
		   .pipe( concat( jsCustomFile  + '.js' )  )
		   .pipe( gulp.dest( jsCustomDestination ) )
		   .pipe( rename( {
       			basename: jsCustomFile,
       			suffix: '.min'
    	 	}))
		   .pipe( uglify().on('error', createErrorHandler('uglify')) )
		   .pipe( gulp.dest( jsCustomDestination ) )
		   .pipe( notify( { message: 'TASK: "compileCustomJS" Completed! 💯', onLast: true } ) );
});


/*Default tasks that will be run when using "gulp" command*/
gulp.task('default', ['compileStyles', 'compileVendorJS', 'compileCustomJS' ],  function(){
	gulp.watch( stylesSource, ['compileStyles'] );
	gulp.watch( jsVendorSource, ['compileVendorJS'] );
	gulp.watch( jsCustomSource, ['compileCustomJS'] );
});