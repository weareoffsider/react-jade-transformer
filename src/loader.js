var mapper = require("./mapper.js");
var walker = require("./walker.js");
var loaderUtils = require("loader-utils");

var doTransform = function(string, options) {
  if (options.prepare) string = mapper(string);
  if (options.transform) string = walker(string);
  return string;
};

module.exports = function(source) {
  var loaderOptions = loaderUtils.getOptions(this)
  var options = loaderOptions || {prepare: true, transform: true}

  console.log(options);

  return doTransform(source, options)
};
