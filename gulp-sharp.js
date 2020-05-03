const through = require("through2");
const gulputil = require("gulp-util");
const sharp = require("sharp");

module.exports = (options) =>
  through.obj((file, encoding, callback) => {
    if (file.isNull()) {
      callback(null, file);
      return;
    }
    if (file.isStream()) {
      callback(new gulputil.PluginError("gulp-sharp", "Streams un supported"));
    }

    if (file.isBuffer()) {
      const payload = {};
      if (options.width && typeof options.width === "number") {
        payload.width = options.width;
      }
      if (options.height && typeof options.height === "number") {
        payload.height = options.height;
      }

      sharp(file.contents)
        .resize(payload)
        .toBuffer()
        .then((data) => {
          callback(
            null,
            new gulputil.File({
              base: file.base,
              cwd: file.cwd,
              path: file.path,
              contents: data,
            })
          );
        });
    }
  });
