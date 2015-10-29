var through = require("through2");
var gutil = require("gulp-util");

var mapper = require("./mapper.js");
var walker = require("./walker.js");
var esprima = require("esprima");
var escodegen = require("escodegen");


module.exports.browserify = function(options) {
  options = options || {prepare: true, transform: true}

  return function(file) {
    return through.obj(function(chunk, enc, cb) {
      var out = chunk.toString();
      cb(null, new Buffer(doTransform(out, options)));
    });
  }
};

var doTransform = function(string, options) {
  if (options.prepare) string = mapper(string);
  if (options.transform) string = walker(string);
  return string;
};

module.exports.gulp = function(options) {
  options = options || {prepare: true, transform: true}
  
  return through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      cb(null, file);
    }
    if (file.isBuffer()) {
      var out = file.contents.toString();

      file.contents = new Buffer(doTransform(out, options));
    }
    if (file.isStream()) {
      this.emit("error", new gutil.PluginError(
        "react-jade-transform", 
        "Streaming not supported"
      ));
      return cb();
    }

    cb(null, file);
  });
};

module.exports.babel = function(bb) {
  var types = bb.types;
  return new bb.Plugin("react-jade-transformer-prepare", {
    visitor: {
      Program: function(node, parent) {
        var genCode = escodegen.generate(node);
        var preppedCode = mapper(genCode);
        var preppedCode = walker(preppedCode);
        return esprima.parse(preppedCode);
      },
    },
  });
};
