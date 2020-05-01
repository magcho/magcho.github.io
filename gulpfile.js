// basic
const gulp = require("gulp");
const { parallel, series } = require("gulp");
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const browserSync = require("browser-sync").create();
const gulpif = require("gulp-if");
const minimist = require("minimist");

// js
const webpak = require("webpack");
const webpackStream = require("webpack-stream");

// pug
const pug = require("gulp-pug");
const htmlmin = require("gulp-htmlmin");
const htmlminConfig = require("./htmlmin.config");

// stylus
const stylus = require("gulp-stylus");
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");

// image
const imagemin = require("gulp-imagemin");
const imageResize = require("gulp-image-resize"); // require imagemagic, graphicsmagick

// config
const webpackConfig = require("./webpack.config");
const DEST_DIR = "./dist";

// init env
const options = minimist(process.argv.slice(2), {
  string: "env",
  default: { env: process.env.NODE_ENV || "development" },
});
isProduction = options.env === "production" ? true : false;
if (isProduction) {
  webpackConfig.mode = "production";
}
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
    .src(["./src/pug/[!_]*.pug"])
    .pipe(
      plumber({
        errorHandler: notify.onError("<%= error.message %>"),
      })
    )
    .pipe(pug({ pretty: !isProduction }))
    .pipe(gulpif(isProduction, htmlmin(htmlminConfig)))
    .pipe(gulp.dest(DEST_DIR))
    .on("end", cb);
};
exports.pugBuild = pugBuild;

const stylusBuild = (cb) => {
  gulp
    .src("./src/stylus/**/[!_]*.styl")
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
    .pipe(gulpif(isProduction, cleanCSS()))
    .pipe(gulp.dest(`${DEST_DIR}`));
  cb();
};
exports.stylusBuild = stylusBuild;

const imgCopy = (cb) => {
  gulp
    .src(["./src/img/*.+(jpg|png|svg)", "./src/pug/md/img/*.+(jpg|png|svg)"])
    .pipe(
      gulpif(
        isProduction,
        gulpif(
          "*.+(jpg|png)",
          imageResize({
            width: 920,
            height: 0,
          })
        )
      )
    )
    .pipe(gulpif(isProduction, imagemin()))
    .pipe(gulp.dest(`${DEST_DIR}/img`))
    .on("end", cb);
};
exports.imgCopy = imgCopy;

const modelCopy = (cb) => {
  gulp
    .src("./src/model/*")
    .pipe(gulp.dest(`${DEST_DIR}/model`))
    .on("end", cb);
};
exports.modelCopy = modelCopy;

const pugActivityPageBuild = (cb) => {
  gulp
    .src("./src/pug/md/--generated/[!_]*.pug")
    .pipe(pug({ pretty: !isProduction }))
    .pipe(gulpif(isProduction, htmlmin(htmlminConfig)))
    .pipe(gulp.dest(`${DEST_DIR}/activity`))
    .on("end", cb);
};
exports.pugActivityPageBuild = pugActivityPageBuild;

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
    { ignoreInitial: true },
    series(typescriptBuild, reload)
  );
  gulp.watch(
    "./src/**/*.pug",
    { ignoreInitial: true },
    series(pugBuild, reload)
  );
  gulp.watch(
    "./src/**/*.styl",
    { ignoreInitial: true },
    series(stylusBuild, reload)
  );
  gulp.watch(["./src/img/*", "./src/pug/md/img/*"], series(imgCopy, reload));
  gulp.watch("./src/model/*"), series(modelCopy, reload);
};
exports.watch = watch;

gulp.task("server", createServer);

exports.default = series(
  parallel(typescriptBuild, pugBuild, stylusBuild, imgCopy, modelCopy),
  parallel(createServer, watch)
);

gulp.task(
  "build",
  parallel(
    typescriptBuild,
    pugBuild,
    pugActivityPageBuild,
    stylusBuild,
    modelCopy,
    imgCopy
  )
);
