const fs = require("fs");
const fse = require("fs-extra");
const path = require("path");
const settings = require("../configs/settings");

// Подготавливает директорию сборки фронта
// Создаёт директорию сборки ./build если её нет, иначе очищаем её.
function prepareBuildDir() {
  const buildDir = "../build/";

  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir);
  } else {
    clean(buildDir);
  }
}

// Очищает заданную директорию - folder.
function clean(folder, exception) {
  const folderPath = path.resolve(__dirname, folder);

  try {
    const files = fs.readdirSync(folderPath);

    if (files.length === 0) {
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const filePath = `${folderPath}/${files[i]}`;

      if (
        !exception ||
        !exception.length ||
        exception.indexOf(files[i]) === -1
      ) {
        if (fs.statSync(filePath).isFile()) {
          fs.unlinkSync(filePath);
        } else {
          fse.removeSync(filePath);
        }
      }
    }
  } catch (e) {
    return;
  }
}

// Копирует файл - inputFile в файл - outputFile.
function copy(inputFile = "", outputFile = "") {
  return new Promise((resolve, reject) => {
    if (!inputFile || !outputFile) {
      throw new Error("Input or output files are empty");
    }

    fs.readFile(path.resolve(__dirname, inputFile), "utf8", (error, data) => {
      if (error) {
        return reject(error);
      }

      const nameClientRegExp = new RegExp("NAME", "g");
      const versionRegExp = new RegExp("VERSION", "g");

      const result = data
                        .replace(nameClientRegExp, settings.NAME)
                        .replace(versionRegExp, settings.VERSION);

      fs.writeFile(
        path.resolve(__dirname, outputFile),
        result,
        "utf8",
        (error) => {
          if (error) {
            return reject(error);
          }

          resolve();
        }
      );
    });
  });
}

module.exports = {
  prepareBuildDir,
  copy
};
