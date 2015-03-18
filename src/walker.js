var Parser = require("jade/lib/parser.js");
var jade = require("jade/lib/runtime.js");
var esprima = require("esprima");
var escodegen = require("escodegen");
var jadeToReact = require("./jadeToReact.js");

module.exports = function(transform) {
  var ast = esprima.parse(transform);

  ast = walk(ast);
  var genCode = escodegen.generate(ast);

  return genCode;
}

var walk = function(node) {
  switch (node.type) {
    case "Program":
    node.body.map(walk); break;
    
    case "VariableDeclaration":
    node.declarations.map(walk); break;

    case "VariableDeclarator":
    node.init = walk(node.init);
    break;

    case "ObjectExpression":
    node.properties.map(walk); break;

    case "Property":
    node.value = walk(node.value); break;

    case "FunctionExpression":
    node.body = walk(node.body); break;

    case "BlockStatement":
    node.body.map(walk); break;

    case "ReturnStatement":
    node.argument = walk(node.argument); break;

    case "CallExpression":
    if (node.callee.name == "___reactJadeTransform") {
      return jadeToReact(node.arguments[0].value);
    } else {
      node.callee = walk(node.callee);
      node.arguments.map(walk);
    }
    break;
  }
  return node;
};
