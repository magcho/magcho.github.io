const GooglefontsPlugin = require("google-fonts-plugin");

module.exports = {
  // モード値を production に設定すると最適化された状態で、
  // development に設定するとソースマップ有効でJSファイルが出力される
  mode: "development",

  // メインとなるJavaScriptファイル（エントリーポイント）
  entry: "./src/script/index.ts",
  // entry: "./src/script/test.ts",
  // ファイルの出力設定
  output: {
    //  出力ファイルのディレクトリ名
    path: `${__dirname}/dist/`,
    // 出力ファイル名
    filename: "main.js",
    // filename: "test.js",
  },
  module: {
    rules: [
      {
        // 拡張子 .ts の場合
        test: /\.ts$/,
        // TypeScript をコンパイルする
        use: "ts-loader",
      },
    ],
  },
  // import 文で .ts ファイルを解決するため
  resolve: {
    extensions: [".ts", ".js"],
  },
  // devServer: {
  //   contentBase: `${__dirname}/dist`,
  //   open: true
  // }
};
