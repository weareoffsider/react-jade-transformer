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
  if (!node) return node;
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
    node.body = node.body.map(walk); break;

    case "ReturnStatement":
    node.argument = walk(node.argument); break;

    case "CallExpression":
    if (node.callee.name == "___reactJadeTransform") {
      return jadeToReact(node.arguments[0].value);
    } else {
      node.callee = walk(node.callee);
      node.arguments = node.arguments.map(walk);
    }
    break;

    case "ExpressionStatement":
    node.expression = walk(node.expression);
    break;

    case "ConditionalExpression":
    node.test = walk(node.test);
    node.consequent = walk(node.consequent);
    node.alternate = walk(node.alternate);
    break;

    case "IfStatement":
    node.test = walk(node.test);
    node.consequent = walk(node.consequent);
    node.alternate = walk(node.alternate);
    break;

    case "ForInStatement":
    case "ForStatement":
    node.body = walk(node.body); break;

    case "NewExpression":
    node.callee = walk(node.callee);
    node.arguments = node.arguments.map(walk);
    break;

    case "FunctionDeclaration":
    node.body = walk(node.body); break;

    case "SwitchStatement":
    node.discriminant = walk(node.discriminant);
    node.cases = node.cases.map(walk);
    break;

    case "SwitchCase":
    node.test = walk(node.test);
    node.consequent = node.consequent.map(walk);
    break;

    case "WhileStatement":
    node.test = walk(node.test);
    node.body = walk(node.body);
    break;

    case "ArrayExpression": 
    node.elements = node.elements.map(walk); break;

    case "SequenceExpression": 
    node.expressions = node.expressions.map(walk); break;

    case "LogicalExpression":
    case "BinaryExpression":
    case "AssignmentExpression":
    node.left = walk(node.left);
    node.right = walk(node.right);
    break;

    case "ThrowStatement":
    case "UpdateExpression":
    case "UnaryExpression":
    node.argument = walk(node.argument);
    break;

    case "TryStatement":
    node.block = walk(node.block);
    node.handler = walk(node.handler);
    node.finalizer = walk(node.finalizer);
    node.handlers = node.handlers.map(walk);
    break;

    case "CatchClause":
    node.param = walk(node.param);
    node.body = walk(node.body);
    break;

    case "MemberExpression": break;
    case "Literal": break;
    case "Identifier": break;
    case "BreakStatement": break;
    case "ThisExpression": break;
    case "EmptyStatement": break;

    default:
    console.log("Unhandled Node in Tree", node);
  }

  return node;
};
