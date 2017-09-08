var Parser = require("jade/lib/parser.js");
var jade = require("jade/lib/runtime.js");
var esprima = require("esprima");
var _ = require("lodash");


module.exports = function(string, thisVar) {
  var jadeString = flattenLeftWhitespace(string);

  var parser = new Parser(jadeString, null, {});
  var jadeTree = parser.parse();

  if (jadeTree.nodes.length != 1) {
    throw new Error(
      "Jade React Transforms must have exactly 1 root node :: \n" + jadeString
    );
  }

  var jsTree = convertJadeTreeWithThis(jadeTree, thisVar);

  return jsTree;
};

var flattenLeftWhitespace = function(string) {
  var lines = string.split("\n").filter(function(line) {
    return line.trim().length != 0;
  });

  var minIndentation = lines.reduce(function(smallest, line) {
    if (line.trim().length == 0) return smallest;

    var match = line.match(/^(\s+)/);
    var indent = match ? match[0].length : 0;

    return Math.min(smallest, indent);
  }, 9000);

  return lines.map(function(line) {
    return line.slice(minIndentation);
  }).join("\n");
}


var convertJadeTreeWithThis = function(jadeTree, thisVar) {
  // nesting function declarations to ensure thisVar available to whole
  // computation without excessive passing around in arguments
  return convertJadeTree(jadeTree);

  function convertJadeTree(jadeNode, ix, siblings, nested) {
    if (jadeNode.nodes) {
      return convertJadeTree(jadeNode.nodes[0]);
    } else if (jadeNode.buffer) { // is a variable
      return {
        "type": "Identifier",
        "name": jadeNode.val
      };
    } else if (jadeNode.expr) {


      var cases = jadeNode.block.nodes.map(function(caseNode) {
        var sExpr = caseNode.expr == "default"
          ? null
          : esprima.parse(caseNode.expr).body[0].expression;

        return {
          "type": "SwitchCase",
          "test": sExpr,
          "consequent": [{
            "type": "ReturnStatement",
            "argument": convertJadeTree(caseNode.block.nodes[0]),
          }]
        }
      });

      var testExpr = esprima.parse(jadeNode.expr).body[0].expression;

      var switchFunction = {
        "type": "FunctionExpression",
        "id": null,
        "params": [],
        "defaults": [],
        "generator": false,
        "expression": false,
        "body": {
          "type": "BlockStatement",
          "body": [{
            "type": "SwitchStatement",
            "discriminant": testExpr,
            "cases": cases
          }]
        }
      };

      return {
        "type": "CallExpression",
        "callee": {
          "type": "CallExpression",
          "callee": {
            "type": "MemberExpression",
            "computed": false,
            "object": switchFunction,
            "property": {
              "type": "Identifier",
              "name": "bind",
            }
          },
          "arguments": [thisVar]
        },
        "arguments": []
      };
    } else if (jadeNode.obj) { // is an each statement
      if (jadeNode.block.nodes.length > 1) {
        console.warn(
          "React only supports singular DOM Nodes, only the first node will " +
          "render for: "
        );
        console.warn(jadeNode);
      }


      var jsNode = {
        "type": "CallExpression",
        "callee": {
          "type": "MemberExpression",
          "computed": false,
          "object": {
            "type": "Identifier",
            "name": jadeNode.obj
          },
          "property": {
            "type": "Identifier",
            "name": "map"
          },
        },
        "arguments": [{
          "type": "FunctionExpression",
          "id": null,
          "params": [{
            "type": "Identifier",
            "name": jadeNode.val
          }, {
            "type": "Identifier",
            "name": jadeNode.key
          }],
          "defaults": [],
          "generator": false,
          "expression": false,
          "body": {
            "type": "BlockStatement",
            "body": [{
              "type": "ReturnStatement",
              "argument": convertJadeTree(jadeNode.block.nodes[0])
            }]
          }
        }, thisVar]
      };

      return jsNode;
    } else if (jadeNode.val && (
      jadeNode.val.slice(0,4) == "if (" ||
      (jadeNode.val.slice(0,9) == "else if (" && nested) ||
      jadeNode.val.slice(0,8) == "unless (" ||
      (jadeNode.val.slice(0,13) == "else unless (" && nested)
    )) {
      // is an if or unless statement
      // jade does not appear to support 'else unless', but if it ever does
      // we are prepared for it.
      var stringExpr;
      if (jadeNode.val.slice(0,4) == "if (") {
        stringExpr = jadeNode.val.slice(4,-1);
      } else if (jadeNode.val.slice(0,8) == "unless (") {
        stringExpr = "!" + jadeNode.val.slice(8,-1);
      } else if (jadeNode.val.slice(0,9) == "else if (") {
        stringExpr = jadeNode.val.slice(9,-1);
      } else if (jadeNode.val.slice(0,13) == "else unless (") {
        stringExpr = "!" + jadeNode.val.slice(13,-1);
      }
      
      var testExpr = esprima.parse(stringExpr).body[0].expression;

      var next = siblings[ix + 1];
      if (
        (next && next.val && next.val.slice(0, 9) == "else if (") ||
        (next && next.val && next.val.slice(0, 13) == "else unless (")
      ) {
        var alternate = convertJadeTree(next, ix + 1, siblings, true);
      } else {
        var alternate = (next && next.val == "else")
          ? convertJadeTree(next.block.nodes[0])
          : {"type": "Identifier", "name": "null"};
      }

      return {
        "type": "ConditionalExpression",
        "test": testExpr,
        "consequent": convertJadeTree(jadeNode.block.nodes[0]),
        "alternate": alternate
      }
    } else if (jadeNode.val && jadeNode.val.slice(0,4) == "else" ) {
      return null;
    } else if (jadeNode.val) { // is a standard string
      return {
        "type": "Literal",
        "value": jadeNode.val
      };
    } else if (jadeNode.call) { // is a mixin
      var jsNode = {
        "type": "CallExpression",
        "callee": {
          "type": "MemberExpression",
          "computed": false,
          "object": {
            "type": "Identifier",
            "name": "React",
          },
          "property": {
            "type": "Identifier",
            "name": "createElement"
          },
        },
        "arguments": []
      };

      if (jadeNode.args) {
        var props = esprima.parse(jadeNode.args).body[0].expression;
      } else {
        var props = buildPropsFromAttrs(jadeNode.attrs);
      }

      if (jadeNode.attributeBlocks && jadeNode.attributeBlocks.length > 0) {
        props = parseAndAttributes(jadeNode.attributeBlocks, props);
      }

      var children = jadeNode.block
        ? _.compact(jadeNode.block.nodes.map(convertJadeTree))
        : [];

      if (jadeNode.code) {
        children.unshift(convertJadeTree(jadeNode.code));
      }

      jsNode.arguments = [{
        "type": "Identifier",
        "name": jadeNode.name
      }, props].concat(children);
      return jsNode;

    } else { // is a standard dom node
      var unescapedContent = false;
      var jsNode = {
        "type": "CallExpression",
        "callee": {
          "type": "MemberExpression",
          "computed": false,
          "object": {
            "type": "Identifier",
            "name": "DOM",
          },
          "property": {
            "type": "Identifier",
            "name": jadeNode.name,
          },
        },
        "arguments": []
      };

      var props = {
        "type": "ObjectExpression",
        "properties": []
      };


      var props = buildPropsFromAttrs(jadeNode.attrs);

      if (jadeNode.code && jadeNode.code.buffer && !jadeNode.code.escape) {
        unescapedContent = true;
        var children = [];
        props.properties.push(addUnescapedHTML(jadeNode.code));
      } else if (
        jadeNode.block.nodes && jadeNode.block.nodes[0] &&
        !jadeNode.block.nodes[0].escape && jadeNode.block.nodes[0].buffer
      ) {
        unescapedContent = true;
        var children = [];
        props.properties.push(addUnescapedHTML(jadeNode.block.nodes[0]));
      } else {
        var children = jadeNode.block
          ? _.compact(jadeNode.block.nodes.map(convertJadeTree))
          : [];

        if (jadeNode.code) {
          children.unshift(convertJadeTree(jadeNode.code));
        }
      }


      if (jadeNode.attributeBlocks && jadeNode.attributeBlocks.length > 0) {
        props = parseAndAttributes(jadeNode.attributeBlocks, props);
      }

      jsNode.arguments = [props].concat(children);
      return jsNode;
    }


  };

  function isLiteral(str) {
    return (
      (str[0] == '"' && str[str.length-1] == '"' && str.split('"').length == 3) ||
      (str[0] == "'" && str[str.length-1] == "'" && str.split("'").length == 3)
    )
  };


  function parseAndAttributes(andAttr, props) {
    var props = props || {
      "type": "ObjectExpression",
      "properties": []
    };
    var attrBlocks = andAttr.map(function(block) {
      return parseAttributeCode(block);
    });

    var isBlankProp = (
      props.type == "ObjectExpression" &&
      props.properties.length == 0
    );

    if (isBlankProp && attrBlocks.length == 1) {
      return attrBlocks[0];
    }

    var attrProps = {
      "type": "CallExpression",
      "callee": {
        "type": "MemberExpression",
        "computed": false,
        "object": {
          "type": "Identifier",
          "name": "Object",
        },
        "property": {
          "type": "Identifier",
          "name": "assign",
        },
      },
      "arguments": [props].concat(attrBlocks)
    }
    return attrProps;
  }


  function buildPropsFromAttrs(attrs) {
    var props = {
      "type": "ObjectExpression",
      "properties": []
    };

    var classes = [];
    var calcClasses = [];

    attrs.forEach(function(attr) {
      var literal = isLiteral(attr.val);
      var val = literal ? eval(attr.val) : attr.val;
      var safeName = attr.name;
      if (safeName == "class") safeName = "className";
      if (safeName == "for") safeName = "htmlFor";


      if (literal && attr.name == "class") {
        classes.push(val);
      } else if (!literal && attr.name == "class") {
        calcClasses.push(val);
      } else if (literal) {
        props.properties.push({
          "type": "Property",
          "key": {
            "type": "Literal",
            "value": safeName,
          },
          "computed": false,
          "value": {
            "type": "Literal",
            "value": val
          },
          "kind": "init",
          "method": false,
          "shorthand": false
        });
      } else {
        props.properties.push({
          "type": "Property",
          "key": {
            "type": "Literal",
            "value": safeName,
          },
          "computed": false,
          "value": parseAttributeCode(val),
          "kind": "init",
          "method": false,
          "shorthand": false
        });

      }
    });

    if (classes.length > 0 || calcClasses.length > 0) {
      var classValue, calcClassValue, finalClassValue;
      if (classes.length > 0) {
        classValue = {
          "type": "Literal",
          "value": classes.join(" ") + " "
        }
      } 
    
      if (calcClasses.length > 0) {
        calcClassValue = calcClasses.reduceRight(function(accExpr, calcExpr) {
          if (!accExpr) {
            return parseAttributeCode(calcExpr)
          } else {
            return {
              "type": "BinaryExpression",
              "operator": "+",
              "left": parseAttributeCode(calcExpr),
              "right": accExpr
            };
          }
        }, null);
      }

      if (classValue && calcClassValue) {
        finalClassValue = {
          "type": "BinaryExpression",
          "operator": "+",
          "left": classValue,
          "right": calcClassValue
        };
      } else {
        finalClassValue = classValue || calcClassValue;
      }

      props.properties.push({
        "type": "Property",
        "key": {
          "type": "Identifier",
          "name": "className",
        },
        "computed": false,
        "value": finalClassValue,
        "method": false,
        "shorthand": false
      });
    }


    return props;
  }


  function addUnescapedHTML(node) {
    return {
      "type": "Property",
      "key": {
        "type": "Identifier",
        "name": "dangerouslySetInnerHTML",
      },
      "computed": false,
      "value": {
        "type": "ObjectExpression",
        "properties": [{
          "type": "Property",
          "key": {
            "type": "Identifier",
            "name": "__html",
          },
          "computed": false,
          "value": parseAttributeCode(node.val),
          "kind": "init",
          "method": false,
          "shorthand": false,
        }]
      },
      "kind": "init",
      "method": false,
      "shorthand": false
    }
  };


  function parseAttributeCode(attrCode) {
    if (attrCode[0] == "{" && attrCode[attrCode.length - 1] == "}") {
      // wrap object literal blocks to ensure esprima parses correctly as
      // as an expression rather than a block
      attrCode = "(" + attrCode + ")";
    }

    var element = esprima.parse(attrCode).body[0];

    switch (element.type) {
      case "ExpressionStatement":
      return replaceThisVar(element.expression);

      case "BlockStatement":
      return replaceThisVar(element.body[0]);
    }
  }

  function replaceThisVar(node) {
    if (!node) return node;
    switch (node.type) {
      case "ExpressionStatement":
      node.expression = replaceThisVar(node.expression);
      break;

      case "CallExpression":
      node.callee = replaceThisVar(node.callee);
      node.arguments = node.arguments.map(replaceThisVar);
      break;

      case "ObjectExpression":
      node.properties = node.properties.map(replaceThisVar);
      break;

      case "Property":
      node.value = replaceThisVar(node.value);
      break;

      case "MemberExpression":
      node.object = replaceThisVar(node.object);
      break;

      case "ArrayExpression": 
      node.elements = node.elements.map(replaceThisVar); break;

      case "ConditionalExpression":
      node.test = replaceThisVar(node.test);
      node.consequent = replaceThisVar(node.consequent);
      node.alternate = replaceThisVar(node.alternate);
      break;

      case "ThrowStatement":
      case "UpdateExpression":
      case "UnaryExpression":
      node.argument = replaceThisVar(node.argument);
      break;

      case "LogicalExpression":
      case "BinaryExpression":
      case "AssignmentExpression":
      node.left = replaceThisVar(node.left);
      node.right = replaceThisVar(node.right);
      break;

      case "ThisExpression":
      return thisVar;
    }

    return node;
  }
};


