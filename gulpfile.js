// basic
const gulp = require("gulp");
const { parallel, series } = require("gulp");
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const browserSync = require("browser-sync").create();

// js
const webpak = require("webpack");
const webpackStream = require("webpack-stream");

// pug
const pug = require("gulp-pug");

// stylus
const stylus = require("gulp-stylus");
const autoprefixer = require("gulp-autoprefixer");

// config
const webpackConfig = require("./webpack.config");
const DEST_DIR = "./dist";

const typescriptBuild = function (cb) {
  return webpackStream(webpackConfig, webpak)
    .on("error", function (e) {
      this.emit("end");
    })
    .pipe(gulp.dest(DEST_DIR));
};
exports.typescriptBuild = typescriptBuild;

const pugBuild = (cb) => {
  gulp
    .src(["./src/pug/**/*.pug", "!./src/pug/**/*._pug"])
    .pipe(
      plumber({
        errorHandler: notify.onError("<%= error.message %>"),
      })
    )
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest(DEST_DIR));
  cb();
};
exports.pugBuild = pugBuild;

const stylusBuild = (cb) => {
  gulp
    .src("./src/stylus/**/!(_)*.styl")
    .pipe(
      plumber({
        errorHandler: notify.onError("<%= error.message %>"),
      })
    )
    .pipe(stylus())
    .pipe(
      autoprefixer({
        overrideBrowserslist: "last 2 versions",
      })
    )
    .pipe(gulp.dest(`${DEST_DIR}/css`));
  cb();
};
exports.stylusBuild = stylusBuild;

const createServer = (cb) => {
  browserSync.init({
    server: {
      baseDir: DEST_DIR,
    },
  });
  cb();
};

const watch = () => {
  const reload = (cb) => {
    browserSync.reload();
    cb();
  };
  gulp.watch(
    "./src/**/*.ts",
    { ignoreInitial: false },
    series(typescriptBuild, reload)
  );
  gulp.watch(
    "./src/**/*.pug",
    { ignoreInitial: false },
    series(pugBuild, reload)
  );
  gulp.watch(
    "./src/**/*.styl",
    { ignoreInitial: false },
    series(stylusBuild, reload)
  );
};
exports.watch = watch;

exports.default = series(
  parallel(typescriptBuild, pugBuild, stylusBuild),
  parallel(createServer, watch)
);
