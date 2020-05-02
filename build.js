const fs = require("fs");
const path = require("path");
const licenseList = require("license-list");

class Build {
  fileList = [];
  currentPath = "";

  constructor() {
    this.fileList = this.getFileList(path.join(__dirname, "./src/pug/md"));
  }
  do() {
    this.perseMd(this.fileList);
    this.createActivity();
    this.createPostPage();
  }

  /*
   * src/md/ディレクトリ下のファイル名一覧を取得
   */
  getFileList(targetDirPath) {
    const list = fs
      .readdirSync(targetDirPath)
      .filter((fileName) => /\d{1,2}\w*\.md$/.test(fileName));

    return list.map((fileName) => ({
      path: path.join(__dirname, "./src/pug/md/", fileName),
      name: fileName,
      title: "",
      thumnailPath: "",
      markdown: "",
      href: `./activity/${fileName.replace(".md", ".html")}`,
    }));
  }

  /*
   * markdownから各種情報を取得
   */
  perseMd(fileList) {
    this.fileList = fileList.map((file) => {
      const stream = fs.readFileSync(file.path);

      stream
        .toString()
        .split("\n")
        .map((line) => {
          if (/^\s*#\s+.+$/.test(line)) {
            file.title = line.replace(/^#\s/, "");
          }
          if (/^\s*!\[.*\]\(.*\)\s*$/.test(line)) {
            file.thumnailPath = line
              .replace(/^\s*!\[.*\]/, "")
              .replace("(", "")
              .replace(")", "")
              .replace(/\s*/g, "");
          }
          file.markdown = stream;
        });
      return file;
    });
  }

  /*
   * indexページのリストを生成
   */
  createActivity() {
    const listViewBuff = [];
    this.fileList.map((file) => {
      // list buff
      const item = {
        title: file.title,
        thumnailPath: file.thumnailPath,
        href: file.href,
      };
      listViewBuff.push(item);
    });

    const fileBuff = `- var activityList = ${JSON.stringify(listViewBuff)}`;
    fs.writeFileSync(
      path.join(__dirname, "./src/pug", "_activity.pug"),
      fileBuff
    );
  }

  /*
   * 各リンク先ページのジェネレータ
   */
  createPostPage() {
    const temlpalePug = fs
      .readFileSync(path.join(__dirname, "./src/pug/_template.pug"))
      .toString();

    this.fileList.map((file) => {
      const outBuff = temlpalePug
        .replace("XXXXX", `../${file.name}`)
        .replace("./img", "../img");
      fs.writeFileSync(
        path.join(
          __dirname,
          "./src/pug/md/--generated/",
          file.name.replace(".md", ".pug")
        ),
        outBuff
      );
    });
  }
}

console.log("build.js start");
const build = new Build();
build.do();
console.log("build.js finish");
