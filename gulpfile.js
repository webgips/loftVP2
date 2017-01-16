const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const autoprefixer = require('gulp-autoprefixer');
const minifycss = require('gulp-csso');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();
const gulpIf = require('gulp-if');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const del = require('del');
const runSequence = require('run-sequence');
// SVG sprite
// const svgSprite = require('gulp-svg-sprite');
// const svgmin = require('gulp-svgmin');
// const cheerio = require('gulp-cheerio');
// const replace = require('gulp-replace');

/* ------ Конфигурация и настройка сборки  -------- */
const isDevelopment = false;
// const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';
// Пути к нашим модулям JS
var moduleJs = [
  'app/js/main.js'  
  ];
// Пути к нашим внешним плагинам и библиотекам javascript
var vendorJs = [
  'app/bower/jquery/dist/jquery.min.js',
  'app/bower/fancybox/source/jquery.fancybox.pack.js',
  'app/bower/jquery.inputmask/dist/min/inputmask/inputmask.min.js',  
  'app/bower/jquery.inputmask/dist/min/inputmask/inputmask.extensions.min.js',   
  'app/bower/jquery.inputmask/dist/min/inputmask/jquery.inputmask.min.js'   
  ];
// Пути к нашим внешним плагинам и библиотекам css
var vendorCss = [
  'app/bower/normalize-css/normalize.css',   
  'app/bower/fancybox/source/jquery.fancybox.css',   
  ];

// Запускаем сервер. Предварительно выполнив задачи ['html', 'styles', 'images',
// 'buildJs', 'vendor-js'] Сервер наблюдает за папкой "./dist". Здесь же
gulp.task('browser-sync', [
  'html',
  'styles',
  'images',
  'build:js',
  'vendor:js',
  'vendor:css',
  'fonts'
], function () {
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  });
  // наблюдаем и обновляем страничку
  browserSync.watch([
    './dist/**/*.*', '!**/*.css'
  ], browserSync.reload);
});


// перенос html
gulp.task('html', function(){
  return gulp.src('app/*.html')
    .pipe(gulp.dest('dist'));
});

// перенос шрифтов
gulp.task('fonts', function(){
  return gulp.src('app/fonts/**/*.*')
    .pipe(gulp.dest('dist/fonts'));
});

// перенос и оптимизация картинок
gulp.task('images', function () {
  return gulp
    .src('app/content/**/*.{png,svg,jpg}')
    .pipe(cache(imagemin({optimizationLevel: 3, progressive: true, interlaced: true})))
    .pipe(gulp.dest('dist/content/'));
});

// Style
gulp.task('styles', function(){
  return gulp.src(['app/scss/main.scss'])
  .pipe(plumber({
    errorHandler: notify.onError(function (err) {
      return {title: 'Style', message: err.message}
    })
  }))
  .pipe(gulpIf(isDevelopment, sourcemaps.init()))
  .pipe(sass())
  .pipe(autoprefixer('last 2 versions'))
  .pipe(rename({suffix: '.min'}))
  .pipe(minifycss())
  .pipe(gulpIf(isDevelopment, sourcemaps.write('maps')))
  .pipe(gulp.dest('dist/css'))
  .pipe(browserSync.stream())
});

//Модули javascript. С минификацией и переносом
gulp.task('build:js', function () {
  return gulp
    .src(moduleJs)
    .pipe(plumber({
      errorHandler: notify.onError(function (err) {
        return {title: 'javaScript', message: err.message}
      })
    }))
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(gulpIf(isDevelopment, sourcemaps.write('maps')))
    .pipe(gulp.dest('dist/js'));
});

/* -------- Объединение всех подключаемых плагинов в один файл -------- */
gulp.task('vendor:js', function () {
  return gulp
    .src(vendorJs)
    .pipe(concat('vendor.min.js'))
    .pipe(gulp.dest('dist/js'));
});
/* -------- Объединение всех стилей подключаемых плагинов в один файл -------- */
gulp.task('vendor:css', function () {
  return gulp
    .src(vendorCss)
    .pipe(concat('vendor.min.css'))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/css/'));
});

gulp.task('watch', function () {
  gulp.watch("app/*.html", ['html']);
  gulp.watch("app/scss/**/*.scss", ['styles']);
  gulp.watch("app/js/**/*.js", ['build:js']);
  gulp.watch("app/img/**/*.*", ['images']);
});

gulp.task('default', ['browser-sync', 'watch']);

// Очистка папки dist
gulp.task('clean', function () {
  return del(['dist'], {force: true}).then(paths => {
    console.log('Deleted files and folders: in dist');
  });
});

// Выполнить билд проекта
gulp.task('build', function (callback) {
  runSequence(['clean'], [
    'html',
    'styles',
    'images',
    'build:js',
    'vendor:js',
    'vendor:css',
    'fonts'
  ], callback);
});

gulp.task('build:svg', function () {
  return gulp.src('app/temp/icons/*.svg')
  // минифицируем svg
    .pipe(svgmin({
    js2svg: {
      pretty: true
    }
  }))
  // удалить все атрибуты fill, style and stroke в фигурах
    .pipe(cheerio({
    run: function ($) {
      $('[fill]').removeAttr('fill');
      $('[stroke]').removeAttr('stroke');
      $('[style]').removeAttr('style');
    },
    parserOptions: {
      xmlMode: true
    }
  }))
  // cheerio плагин заменит, если появилась, скобка '&gt;', на нормальную.
    .pipe(replace('&gt;', '>'))
  // build svg sprite
    .pipe(svgSprite({
    mode: {
      symbol: {
        sprite: "../sprite.svg",
        example: {
          dest: '../tmp/spriteSvgDemo.html' // демо html
        }
      }
    }
  }))
    .pipe(gulp.dest('app/img'));
});