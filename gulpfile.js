var gulp = require('gulp');
var gulpJade = require('gulp-jade');
var browserSync = require('browser-sync'); //服务器代理
var runSequence = require('run-sequence'); //串行gulp任务插件（顺序执行）
var gulpSequence = require('gulp-sequence'); //串行gulp任务插件（顺序执行）
var concat = require('gulp-concat'); //文件合并
var minifycss = require('gulp-minify-css'); //压缩css
var stylus = require('gulp-stylus'); //压缩css
var uglify = require('gulp-uglify'); //压缩js
var htmlmin = require('gulp-htmlmin');//压缩html
var rename = require('gulp-rename'); //重命名
var del = require('del'); //删除指定文件
var notify = require("gulp-notify"); //处理gulp打包报错会终止的问题
var sftp = require('gulp-sftp');// 上传服务器
var babel = require("gulp-babel"); //ES6语法转成ES5
var gutil = require('gulp-util');//压缩html
var imageMin = require('gulp-imagemin');//images压缩

// 删除打包后的文件夹
gulp.task("del", function (callback) {
  return del(['./dist/*'], callback)
})

// jade转换为html
gulp.task('jade2html', function () {
  // 公共的.jade文件不打包
  return gulp.src(['./src/views/**/*.jade', '!./src/views/\_*/**'])
    .pipe(gulpJade())
    .on('error', handleErrors)
    .pipe(gulp.dest('./dist'))
})

// // 压缩css
// gulp.task("minifycss", function () {
//   return gulp.src('./src/static/css/*.css')
//     .pipe(minifycss())
//     .pipe(concat('all_style.css'))
//     .pipe(gulp.dest('dist/static/css'))
// })

// 压缩styl
gulp.task("stylus", function () {
  return gulp.src('./src/static/css/main.styl')
    .pipe(stylus())
    .pipe(concat('all_style.css'))
    .pipe(gulp.dest('dist/static/css'))
})

//打包js
gulp.task("minifyJs", function () {
  return gulp.src('./src/static/js/*.js')
    .pipe(babel({
      presets:['es2015']
    }))
    .pipe(uglify())
    // .pipe(concat('all_js.js'))
    .on('error', function (err) {
      gutil.log(gutil.colors.red('[Error]'), err.toString());
    })
    .pipe(gulp.dest('dist/static/js'))
})

// 压缩图片
gulp.task('images', function () {
  return gulp.src('./src/static/images/*')
    .pipe(imageMin({progressive: true}))
    .pipe(gulp.dest('./dist/static/images/'));
})

//复制插件的css
gulp.task('copy', function (done) {
  return gulp.src('./src/static/plugIn/*.js')
    .pipe(gulp.dest('./dist/static/plugIn/'))
})

// 公共插件复制
gulp.task("musics", function() {
  return gulp.src("./src/static/musics/*")
  .pipe(gulp.dest('./dist/static/musics/'))
})

// watch监听文件变化
gulp.task('watch', function () {
  gulp.watch('./src/static/css/*.styl', ['stylus'])
  gulp.watch('./src/static/js/*.js', ['minifyJs'])
  gulp.watch('./src/static/images/*', ['images'])
  gulp.watch('./src/static/musics/*', ['musics'])
  gulp.watch('./src/views/**/*.jade', ['jade2html'])
})

// 公共插件复制
gulp.task("jqcopy", function() {
  return gulp.src("./src/static/plugin/*")
  .pipe(gulp.dest('./dist/static/plugin/'))
})

// 服务器代理
gulp.task("browserSync", function () {
  return browserSync.init({
    server: {
      baseDir: 'dist', //设置服务器的根目录
      index: 'index.html' //默认打开的页面
    },
    files: ['**'],
    port: '8088' //指定服务端口号
  })
})

// 错误处理机制(当出现错误时，直接跳过)
function handleErrors() {
  var args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: 'compile error',
    message: '<%=error.message %>'
  }).apply(this, args); //替换为当前对象
  this.emit(); //提交
}

// 执行任务
gulp.task('dev', function () {
  runSequence('del', [ 'jade2html', 'stylus', 'minifyJs', 'copy', 'images', 'musics'], 'browserSync', 'watch')
})


// =====================================  ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ 开发环境  ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑  =====================================



// =====================================  ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ 生产环境  ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓  =====================================

var emit = require('./.config');

var path = {
  input: {
    html: ['./src/views/**/*.jade'],
    js: ['./src/static/js/*.js'],
    stylus: ['./src/static/css/*.styl'],
    zip: ['./dist/**/*']
  },
  output: {
    dist: './dist',
    stylus: './dist/static/css/',
    js: './dist/static/js/'
  }
}

gulp.task('minifyHtml', function () {
  var options = {
    removeComments: true,//清除HTML注释
    collapseWhitespace: true,//压缩HTML
    collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
    removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
    removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
    removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
    minifyJS: true,//压缩页面JS
    minifyCSS: true//压缩页面CSS
  };
  return gulp.src(['./src/views/**/*.jade', '!./src/views/\_*/**'])
    .pipe(gulpJade())
    .pipe(htmlmin(options))
    .pipe(gulp.dest(path.output.dist))//gulp dest是输出
});

// gulp.task('minifyJs', function () {
//   return gulp.src(path.input.js)
//     // .pipe(ngAnnotate({ single_quotes: true }))
//     .pipe(babel({
//       presets:['es2015']
//     }))
//     .pipe(uglify())
//     .on('error', function (err) {
//       gutil.log(gutil.colors.red('[Error]'), err.toString());
//     })
//     .pipe(gulp.dest(path.output.js))
// });


// 发送至服务器
gulp.task('sftp', function () {
  gulp.src(path.input.zip)
    .pipe(sftp(Object.assign(emit.server)))
});
// 启动打包程序
gulp.task('build',function(){
  runSequence('del',['minifyHtml', 'images', 'jqcopy', 'stylus', 'minifyJs', 'musics'],'sftp')
});