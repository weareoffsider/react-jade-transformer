var browserify = require("browserify"),
    buffer     = require('vinyl-buffer'),
    babelify   = require("babelify"),
    babel      = require("gulp-babel"),
    source     = require('vinyl-source-stream'),
    reactJade  = require("./src/index.js"),
    gulp       = require("gulp");

var WATCH = false;

gulp.task('js', function() {
  var bundler = browserify({
    cache: {}, // watchify arguments
    packageCache: {}, // watchify arguments
    fullPaths: true, // watchify arguments
    entries: ['./test/complex.js'],
    debug: true
  }).transform(reactJade.browserify({prepare: true}))
    .transform(babelify)
    .transform(reactJade.browserify({transform: true}));

  var bundle = function() {
    return bundler
      .bundle()
      .on("error", function(err) {
        console.log(err.message);
        this.emit("end");
      })
      .pipe(source("app-bundle.js"))
      .pipe(gulp.dest('./.tmp/testout'));
  };

  if (WATCH) {
    bundler = watchify(bundler);
    bundler.on('update', bundle);
    bundler.on("time", function(time) {
      console.log("Javascript Bundle updated: " + time + "ms");
    });
    bundler.on("error", function(err) {
      console.log(err.message);
      this.emit("end");
    });
  }

  return bundle();
});


gulp.task("node", function() {
  // return gulp.src("./test/*.js")
  return gulp.src("./test/thisPropagation.js")
             .pipe(reactJade.gulp({prepare: true}))
             .pipe(babel())
             .pipe(reactJade.gulp({transform: true}))
             .pipe(gulp.dest("./.tmp/testout"));
});
