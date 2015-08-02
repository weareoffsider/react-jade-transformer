var esprima = require("esprima");
var walker = require("./walker.js");


module.exports = function(src) {
  var stringTransform = ""
  var cursor = 0;
  var inJadeBlock = false;
  while (cursor < src.length) {
    if (src.slice(cursor, cursor+3) == "rj`") {
      cursor += 3
      stringTransform += '___reactJadeTransform("'
      inJadeBlock = true
    } else if (inJadeBlock && src[cursor] == "`") {
      cursor++
      stringTransform += '", this)'
      inJadeBlock = false
    } else if (inJadeBlock && src[cursor] == "\n") {
      cursor++
      stringTransform += '\\n'
    } else if (inJadeBlock && src[cursor] == '"') {
      cursor++
      stringTransform += '\\"'
    } else {
      stringTransform += src[cursor]
      cursor++
    }
  }

  return stringTransform;
}

