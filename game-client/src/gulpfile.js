const assetsPathConstants = {
  SASS: "assets/sass/*.scss",
};

const gulp = require("gulp"),
  sass = require("gulp-sass"),
  htmlBeautify = require("gulp-html-beautify"),
  del = require("del"),
  autoprefix = require("gulp-autoprefixer"),
  cssnano = require("gulp-cssnano"),
  rename = require("gulp-rename");

gulp.task("compileSass", function () {
  return gulp
    .src(assetsPathConstants.SASS)
    .pipe(sass())
    .pipe(
      autoprefix(["last 15 versions", "> 1%", "ie 8", "ie 7"], {
        cascade: true,
      })
    )
    .pipe(cssnano())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("css"));
});

gulp.task("default", gulp.parallel("compileSass"));
