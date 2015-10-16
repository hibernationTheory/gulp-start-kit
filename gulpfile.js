'use strict';

var gulp = require('gulp');
var connect = require('gulp-connect'); // gulp plugin to run a webserver
var concat = require('gulp-concat'); 
//gulp plugin to concatenate files together, using for css files.
var browserify = require('browserify'); // bundles all js files together
var babelify = require('babelify'); // js transpiler to convert ES6 and JSX
var open = require('gulp-open'); // open a url in the browser
var sass = require('gulp-sass'); // gulp plugin to compile sass to css
var source = require('vinyl-source-stream'); 
// convert readable streams from browserify into gulp streams


var config = {
	'root':['dist'],
	'host':'http://localhost',
	'port':9999,
	'dirs':{
		'src':{
			'css':{
				'rootFolder':'./src/css',
				'rootFiles':'./src/css/**/*.css', 
				'bootstrap':'./node_modules/bootstrap/dist/css/bootstrap.min.css'
			},
			'html':'./src/*.html',
			'indexHtml':'./src/index.html',
			'js':'./src/**/*.js',
			'mainJs':'./src/main.js',
			'sass':'./src/sass/**/*.scss'
		},
		'dist':{
			'css':'./dist/css',
			'bundleJsName':'bundle.js',
			'indexHtml':'./dist/index.html',
			'root':'./dist',
			'rootJs':'./dist/scripts'
		}
	}
}

gulp.task('connect', function() {
	connect.server({
		root:config.root,
		port:config.port,
		livereload:true
	});
});

gulp.task('open', ['connect'], function() {
	gulp.src(config.dirs.dist.indexHtml)
		.pipe(open({uri: config.host + ':' + config.port}));
});

gulp.task('html', function() {
	gulp.src(config.dirs.src.html)
		.pipe(gulp.dest(config.dirs.dist.root))
		.pipe(connect.reload());
});

gulp.task('css', ['sass'], function() {
	gulp.src([config.dirs.src.css.rootFiles, config.dirs.src.css.bootstrap])
		.pipe(concat('styles.css'))
		.pipe(gulp.dest(config.dirs.dist.css))
});

gulp.task('sass', function() {
	gulp.src(config.dirs.src.sass)
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest(config.dirs.src.css.rootFolder))
})

gulp.task('js', function() {
	browserify({
		entries:config.dirs.src.mainJs,
		debug:true,
		transform:[babelify]
	})
		.bundle()
		.pipe(source(config.dirs.dist.bundleJsName))
		.pipe(gulp.dest(config.dirs.dist.rootJs))
		.pipe(connect.reload());
});

gulp.task('watch', function() {
	gulp.watch([config.dirs.src.sass], ['css'])
	gulp.watch([config.dirs.src.css.rootFiles], ['css'])
	gulp.watch([config.dirs.src.html], ['html'])
	gulp.watch([config.dirs.src.js], ['js'])
})

gulp.task('default', ['css', 'sass', 'html', 'js', 'open', 'watch']);