var Parser = require("jade/lib/parser.js");
var jade = require("jade/lib/runtime.js");
var esprima = require("esprima");


module.exports = function(string) {
  var jadeString = flattenLeftWhitespace(string);

  var parser = new Parser(jadeString, null, {});
  var jadeTree = parser.parse();

  if (jadeTree.nodes.length != 1) {
    throw new Error(
      "Jade React Transforms must have exactly 1 root node :: \n" + jadeString
    );
  }

  var jsTree = convertJadeTree(jadeTree);

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


var convertJadeTree = function(jadeNode) {
  if (jadeNode.nodes) {
    return convertJadeTree(jadeNode.nodes[0]);
  } else if (jadeNode.buffer) { // is a variable
    return {
      "type": "Identifier",
      "name": jadeNode.val
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
      }]
    };

    return jsNode;
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

    var props = buildPropsFromAttrs(jadeNode.attrs);
    var children = jadeNode.block
      ? jadeNode.block.nodes.map(convertJadeTree)
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
    var jsNode = {
      "type": "CallExpression",
      "callee": {
        "type": "MemberExpression",
        "computed": false,
        "object": {
          "type": "MemberExpression",
          "computed": false,
          "object": {
            "type": "Identifier",
            "name": "React",
          },
          "property": {
            "type": "Identifier",
            "name": "DOM",
          },
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
    var children = jadeNode.block
      ? jadeNode.block.nodes.map(convertJadeTree)
      : [];

    if (jadeNode.code) {
      children.unshift(convertJadeTree(jadeNode.code));
    }

    jsNode.arguments = [props].concat(children);
    return jsNode;
  }


};


var isLiteral = function(str) {
  return (str[0] == '"' && str[str.length-1] == '"' ||
          str[0] == "'" && str[str.length-1] == "'");
};


var buildPropsFromAttrs = function(attrs) {
  var props = {
    "type": "ObjectExpression",
    "properties": []
  };

  var classes = [];

  attrs.forEach(function(attr) {
    var literal = isLiteral(attr.val);
    var val = literal ? eval(attr.val) : attr.val;
    var safeName = attr.name;
    if (safeName == "class") safeName = "className";
    if (safeName == "for") safeName = "htmlFor";



    if (literal && attr.name == "class") {
      classes.push(val);
    } else if (literal) {
      props.properties.push({
        "type": "Property",
        "key": {
          "type": "Identifier",
          "name": safeName,
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
          "type": "Identifier",
          "name": safeName,
        },
        "computed": false,
        "value": esprima.parse(val).body[0].expression,
        "kind": "init",
        "method": false,
        "shorthand": false
      });
    }
  });

  if (classes.length > 0) {
    props.properties.push({
      "type": "Property",
      "key": {
        "type": "Identifier",
        "name": "className",
      },
      "computed": false,
      "value": {
        "type": "Literal",
        "value": classes.join(" ")
      },
      "method": false,
      "shorthand": false
    });
  }

  return props;
}
