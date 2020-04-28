const fs = require("fs");
const path = require("path");

class Build {
  fileList = [];
  currentPath = "";

  constructor() {
    this.fileList = this.getFileList(path.join(__dirname, "./src/md"));
  }
  do() {
    this.perseMd(this.fileList);
    // console.log(this.fileList);
    this.createActivity();
  }

  /*
   * src/md/ディレクトリ下のファイル名一覧を取得
   */
  getFileList(targetDirPath) {
    const list = fs
      .readdirSync(targetDirPath)
      .filter((fileName) => /\d{1,2}\w*\.md$/.test(fileName));

    return list.map((fileName) => ({
      path: path.join(__dirname, "./src/md/", fileName),
      name: fileName,
      title: "",
      thumnailPath: "",
      markdown: "",
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

  createActivity() {
    const listViewBuff = [];
    this.fileList.map((file) => {
      // list buff
      const item = {
        title: file.title,
        thumnailPath: file.thumnailPath,
      };
      listViewBuff.push(item);

      // file copy
      fs.writeFileSync(file.name, file.markdown);
    });

    const fileBuff = `- var activityList = ${JSON.stringify(listViewBuff)}`;
    fs.writeFileSync(
      path.join(__dirname, "./src/pug", "_activity.pug"),
      fileBuff
    );
  }
}

const build = new Build();
build.do();
