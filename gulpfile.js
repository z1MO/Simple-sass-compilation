const gulp = require('gulp'),
	sass = require('gulp-sass'),
	cssmin = require('gulp-minify-css'),
	autoprefixer = require('gulp-autoprefixer'),
	args = require('yargs').argv;

let env = args.env;


gulp.task('checkenv', () => {
	if(env === undefined || env.length != 3) {
		throw `Specify build options (each parameter through --env):
		$1:
			type: string;
			descr: The path where to get the sass files.
		$2:
			type: string;
			descr: The path where to put compilation.
		$3:
			type: boolean;
			descr: Minify css.

		Sample: \`gulp --env app/sass --env app/css --env false\`
		`;
	}

	return false;
});

// GENER CSS
gulp.task('sass', ['checkenv'], () => {

	gulp.src([env[0] + '/*.sass', env[0] + '/*.scss'])
		.pipe(sass({
			'indentType': 'tab',
			'indentWidth': '1',
			'outputStyle': 'expanded'
		}))
		.pipe(autoprefixer({
			'browsers': ['last 3 versions'],
			'cascade': false
		}))
		.pipe(gulp.dest(env[1]));

	if(env[2] === 'true') {
		gulp.start('watch');

		return gulp.src(env[1] + '/*.css')
			.pipe(cssmin())
			.pipe(gulp.dest(env[1]));
	}

	return true;
});

gulp.task('watch', () => {
	gulp.watch([env[0] + '/*.sass', env[0] + '/*.scss'], ['cssmin']);
});

gulp.task('default', ['sass']);