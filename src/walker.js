var Parser = require("jade/lib/parser.js");
var jade = require("jade/lib/runtime.js");
var esprima = require("esprima");
var escodegen = require("escodegen");
var jadeToReact = require("./jadeToReact.js");

var MATCH = /___reactJadeTransform\(\"(.*)(?=\",)\", ([\w]+)\)/g
var MATCH1 = /___reactJadeTransform\(\"(.*)(?=\",)\", ([\w]+)\)/

module.exports = function(transform, isolate) {
  var transformed = transform;
  var matches = transform.match(MATCH);
  for (var ix = 0; ix < matches.length; ix++) {
    var matchExpr = matches[ix];
    var callAst = esprima.parse(matchExpr);
    var node = callAst.body[0].expression;
    var reactAst = transformNode(node);
    var genCode = escodegen.generate(reactAst);
    transformed = transformed.replace(matchExpr, genCode);
  }

  return transformed;
}


var transformNode = function(node) {
  return jadeToReact(node.arguments[0].value, node.arguments[1]);
};
