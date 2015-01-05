/* jshint node:true */
'use strict';
// generated on 2014-12-28 using generator-gulp-webapp 0.2.0
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var ghpages = require('gh-pages');
var pathUtil = require('path');

gulp.task('styles', function () {
  return gulp.src('app/styles/main.css')
    .pipe($.plumber())
    .pipe($.autoprefixer({browsers: ['last 1 version']}))
    .pipe(gulp.dest('.tmp/styles'));
});

gulp.task('jshint', function () {
  return gulp.src('app/scripts/**/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.jshint.reporter('fail'));
});

gulp.task('html', ['styles'], function () {
  var lazypipe = require('lazypipe');
  var cssChannel = lazypipe()
    .pipe($.csso);
  var assets = $.useref.assets({searchPath: '{.tmp,app}'});

  return gulp.src('app/*.html')
    .pipe(assets)
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', cssChannel()))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', function () {
  return gulp.src('app/images/**/*')
    .pipe($.imagemin({
      progressive: true,
      interlaced: true
    })) //$.cache() - was undoing my file renames for some reason
    .pipe(gulp.dest('dist/images'));
});

gulp.task('extras', function () {
  return gulp.src([
    'app/*.*',
    '!app/*.html',
    'node_modules/apache-server-configs/dist/.htaccess'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('clean', require('del').bind(null, ['.tmp', 'dist']));

gulp.task('connect', ['styles'], function () {
  var serveStatic = require('serve-static');
  var serveIndex = require('serve-index');
  var app = require('connect')()
    .use(require('connect-livereload')({port: 35729}))
    .use(serveStatic('.tmp'))
    .use(serveStatic('app'))
    .use(serveIndex('app'));

  require('http').createServer(app)
    .listen(9000)
    .on('listening', function () {
      console.log('Started connect web server on http://localhost:9000');
    });
});

gulp.task('serve', ['connect', 'watch'], function () {
  require('opn')('http://localhost:9000');
});

gulp.task('watch', ['connect'], function () {
  $.livereload.listen();

  // watch for changes
  gulp.watch([
    'app/*.html',
    '.tmp/styles/**/*.css',
    'app/scripts/**/*.js',
    'app/images/**/*'
  ]).on('change', $.livereload.changed);

  gulp.watch('app/styles/**/*.css', ['styles']);
});

gulp.task('build', ['html', 'images', 'extras'], function () {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

// deploy the public folder to gh-pages
gulp.task('deploy', ["build"], function(cb) {
  var opts = {};
  if(process.env.GH_TOKEN) {
    console.log('Deploying as ', process.env.GIT_NAME);
    opts.repo = 'https://' + process.env.GH_TOKEN + '@github.com/' + process.env.GH_REPO + '.git';
    opts.user = {
      name: process.env.GIT_NAME,
      email: process.env.GIT_EMAIL
    }
  } else {
    console.log('No GH_TOKEN found in env, assuming git is already set up.')
  }
  ghpages.publish(pathUtil.join(process.cwd(), "dist"), opts, cb);
});

gulp.task('default', ['clean'], function () {
  gulp.start('build');
});

