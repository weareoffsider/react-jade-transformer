var fs = require("fs");
var diff = require("diff");
var assert = require("assert");

describe("JS Output", function() {
  it("should match files", function() {
    var files = fs.readdirSync("test");
    var jsFiles = files.filter(function(file) {
      return file.split(".")[1] == "js";
    });

    jsFiles.forEach(function(file) {
      var expected = fs.readFileSync("test/expected/" + file);
      var actual = fs.readFileSync(".tmp/testout/" + file);
      var changes = diff.diffLines(actual.toString(), expected.toString());
      var patch = diff.createPatch(
        file, actual.toString(), expected.toString()
      );
      assert.equal(patch.split("\n").length, 5, patch);
    });
  });

});
