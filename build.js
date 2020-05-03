const fs = require("fs");
const path = require("path");
// const licenseList = require("lilist");

class Build {
  fileList = [];
  currentPath = "";

  /*
   * src/md/ディレクトリ下のファイル名一覧を取得
   */
  do() {
    Promise.resolve()
      .then(
        () =>
          new Promise((resolve) => {
            const fileList = fs
              .readdirSync(path.join(`./src/pug/md`))
              .filter((fileName) => /\d{1,2}\w*\.md$/.test(fileName))
              .map((fileName) => ({
                path: path.join(__dirname, "./src/pug/md/", fileName),
                name: fileName,
                title: "",
                thumnailPath: "",
                markdown: "",
                href: `./activity/${fileName.replace(".md", ".html")}`,
              }));
            resolve(fileList);
          })
      )
      .then(
        (fileList) =>
          new Promise((resolve) => {
            const fileListFilled = fileList.map((file) => {
              const fBuff = fs.readFileSync(file.path);

              fBuff
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
                  file.markdown = fBuff;
                });
              return file;
            });
            resolve(fileListFilled);
          })
      )
      .then(
        (fileList) =>
          new Promise((resolve) => {
            const listViewBuff = [];
            fileList.map((file) => {
              // list buff
              const item = {
                title: file.title,
                thumnailPath: file.thumnailPath,
                href: file.href,
              };
              listViewBuff.push(item);
            });
            const fileBuff = `- var activityList = ${JSON.stringify(
              listViewBuff
            )}`;
            fs.writeFile(
              path.join(__dirname, "./src/pug/_generated", "_activity.pug"),
              fileBuff,
              () => {
                resolve(fileList);
              }
            );
          })
      )
      .then(
        (fileList) =>
          new Promise((resolve) => {
            const temlpalePug = fs
              .readFileSync(path.join(__dirname, "./src/pug/_template.pug"))
              .toString();

            fileList.map((file) => {
              const outBuff = temlpalePug
                .replace("XXXXX", `../md/${file.name}`)
                .replace("./img", "../img");
              fs.writeFileSync(
                path.join(
                  __dirname,
                  "./src/pug/_generated/",
                  file.name.replace(".md", ".pug")
                ),
                outBuff
              );
            });
            resolve();
          })
      );
  }
}

console.log("build.js start");
const build = new Build();
build.do();
console.log("build.js finish");
