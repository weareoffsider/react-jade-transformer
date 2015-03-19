# React Jade Transformer

Yeah, another one... This library is a no frills transformer from Jade Markup
to React components, because I wanted one that works the way I want it to. It
uses the Jade Parser, Esprima, and escodegen under the hood, so parsing and
results should be very true to their initial implementation.

## WARNING
This is an early implementation. Not all features of Jade are transformed into
something sensible in React yet.

**Currently Supported**:

- Elements
- Mixins as Components
- Buffered Output
- Each/For
- If/Else/Unless/Else If
- Switch
- Classes

## Usage

Install with npm

```
npm install --save-dev react-jade-transformer
```


### In Code

Write standard Javascript, (even ES6 transpiled Javascript), and use a special
tag (rj`) to denote Jade:

```
var SimpleComponent = React.createClass({
  exampleProps: {
    title: "The Title",
    subtitle: "The Subtitle"
  },
  render: function() {
    return rj`
      div.component.component--modifier
        h3.component__title= this.props.title
        p= this.props.children
    `
  }
});
```

The Transformer will process any code in between the rj`` backticks.


### Browserify

```
var reactJade = require("react-jade-transformer");

var bundler = browserify({
  entries: ["./code.js"]
}).transform(reactJade.browserify());
```

If you wish to use the transformer in conjunction with another transpiler, for
example ES6, Coffeescript or Typescript, you can break up the transform into two
steps.

```
var reactJade = require("react-jade-transformer");
var babelify = require("babelify"); // es6 transformer

var bundler = browserify({
  entries: ["./code.js"]
}).transform(reactJade.browserify({prepare: true}))
  .transform(babelify)
  .transform(reactJade.browserify({transform: true}));
```

The prepare step converts any rj`` step into a function call:

```
// newlines broken for readability
___reactJadeTransform("\n
  div.component.component--modifier\n
    h3.component__title= this.props.title\n
    p= this.props.children\n
")
```

The transform step converts any call to "___reactJadeTransform" into a React
Component. With this approach, the function call should survive through any
intermediate steps by conventional transpilers, as it is just a standard
Javascript function call with a string argument.

### Gulp

```
var reactJade = require("react-jade-transformer");

gulp.task("node", function() {
  return gulp.src("./test/*.js")
             .pipe(reactJade.gulp())
             .pipe(gulp.dest("./.tmp/testout"));
});
```

The Gulp Transformer supports the same options as Browserify:

```
var reactJade = require("react-jade-transformer");
var coffee = require("gulp-coffee");

gulp.task("node", function() {
  return gulp.src("./test/*.js")
             .pipe(reactJade.gulp({prepare: true}))
             .pipe(coffee())
             .pipe(reactJade.gulp({transform: true}))
             .pipe(gulp.dest("./.tmp/testout"));
});
```


## License
Copyright (c) 2015 Offsider, used under The MIT License (MIT)

License provided in LICENSE.md
