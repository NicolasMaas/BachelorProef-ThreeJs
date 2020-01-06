// Basic packages
const gulp = require('gulp');
const browsersync = require('browser-sync').create();
const plumber = require('gulp-plumber');

// HTML packages
const htmlmin = require('gulp-htmlmin');

// CSS packages
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

// JS packages
const concat = require('gulp-concat');
const eslint = require('gulp-eslint');

// IMG packages
// const imagemin = require('gulp-imagemin');

function browserSync(done) {
	browsersync.init({
		server: {
			baseDir: './dist/',
		},
		port: 3000,
	});
	done();
}

// BrowserSync Reload
function browserSyncReload(done) {
	browsersync.reload();
	done();
}

// HTML moet geminified naar de dist-map gezet worden
function minifyHTML() {
	return gulp
		.src('./src/**/*.html', './src/**/*.php')
		.pipe(
			htmlmin({
				collapseWhitespace: true,
				ignoreCustomFragments: [
					/<%[\s\S]*?%>/,
					/<\?[=|php]?[\s\S]*?\?>/,
				],
			})
		)
		.pipe(gulp.dest('./dist'));
}

// JS willen we samenvoegen, minifien en compatibel maken
function scriptsLint() {
	return gulp
		.src(['./src/assets/scripts/**/*', './gulpfile.js'])
		.pipe(plumber())
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
}

function script() {
	return gulp
		.src(['./src/assets/scripts/lib/*.js', './src/assets/scripts/*.js'])
		.pipe(plumber())
		.pipe(concat('app.bundle.js'))
		.pipe(gulp.dest('./dist/script/'))
		.pipe(browsersync.stream());
}

function style() {
	return gulp
		.src('./src/assets/styles/screen.scss')
		.pipe(sass())
		.pipe(
			rename({
				suffix: '.min',
			})
		)
		.pipe(postcss([autoprefixer(), cssnano()]))
		.on('error', sass.logError)
		.pipe(gulp.dest('./dist/style/'));
}

// Watchen van veranderingen
const serve = gulp.parallel(watchFiles, browserSync, script, style, minifyHTML);

function watchFiles() {
	gulp.watch(
		['./src/assets/scripts/**/*'],
		gulp.series(script, browserSyncReload)
	);

	gulp.watch(['./src/**/*.html'], gulp.series(minifyHTML, browserSyncReload));

	gulp.watch(
		['./src/assets/styles/**/*.scss'],
		gulp.series(style, browserSyncReload)
	);
}

exports.serve = serve;
