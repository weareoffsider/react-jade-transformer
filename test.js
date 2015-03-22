var fs = require("fs");
var diff = require("diff");
var async = require("async");

describe("JS Output", function() {
  it("should match files", function(done) {
    fs.readdir("test", function(err, files) {
      var jsFiles = files.filter(function(file)  {
        return file.split(".")[1] == "js"
      });

      async.map(jsFiles, function(file, cb) {
        fs.readFile("test/expected/" + file, function(err, expected) {
          if (err) return cb(err);
          fs.readFile(".tmp/testout/" + file, function(err, actual) {
            if (err) return cb(err);

            var changes = diff.diffLines(actual.toString(), expected.toString());
            var patch = diff.createPatch(
              file, actual.toString(), expected.toString()
            );
            cb(err, {
              patch: patch,
              changes: changes,
              file: file
            });
          });
        });
      }, function(err, diffs) {
        diffs.forEach(function(fileDiff) {
          if (fileDiff.patch.split("\n").length > 5) {
            throw new Error(fileDiff.patch);
          }
        });
        done();
      });

    });
  });

});
