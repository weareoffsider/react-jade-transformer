var path = require('path')
var jadeToReact = require("./src")

module.exports = {
  entry: {
    simple: "./test/simple.js",
  },
  output: {
    path: path.resolve(__dirname, ".tmp/testout"),
    filename: "[name].js",
  },
  module: {
    rules: [{ 
      test: /\.js$/,
      use: [
        {
          loader: './src/loader',
          options: {
            transform: true,
          },
        },
        {
          loader: './src/loader',
          options: {
            prepare: true,
          },
        },
      ]
    }],
  },
}
