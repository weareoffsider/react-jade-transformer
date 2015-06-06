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



## Transformation Reference

All Jade Transformations would be written inside rj tagged with backticks, for
example rj``span.spanClass``. This reference is written with the assumption that
you know Jade and React syntax.

### Basic Structure

All standard DOM elements will transform to a `React.DOM` call.

```
span.spanClass
```

```
React.DOM.span({ className: 'spanClass ' });
```

Attributes render as properties.

```
.component#someId(data-foo="bar")
```

```
React.DOM.div({
    'id': 'someId',
    'data-foo': 'bar',
    className: 'component '
});
```

Jade Classes will get mixed with a class property, so you can use shorthand
classes in conjunction with classSet or equivalent.

```
.component(class=React.addons.classSet(classesObj))
```

```
React.DOM.div({ className: 'component ' + React.addons.classSet(classesObj) });
```

Object Literals can be passed in for properties such as style.

```
.component(style={width: 234})
```

```
React.DOM.div({
    'style': { width: 234 },
    className: 'component '
});
```

Jade does NOT support objects being passed to standard DOM elements (only
mixins), so this will not work as you expect:

```
.component(propsObj)
```

```
React.DOM.div({
    'propsObj': true,
    className: 'component '
});
```

Nesting Children and Strings works as you would expect:

```
.component
  h1.component__title This is the title
```

```
React.DOM.div({ className: 'component ' },
  React.DOM.h1({ className: 'component__title ' }, 'This is the title')
);
```


### Variables

Variables can be output using the standard Jade syntax for buffered output.

```
.component
  h1.component__title= this.props.title
```

```
React.DOM.div({ className: 'component ' },
  React.DOM.h1({ className: 'component__title ' }, this.props.title)
);
```

This would also work for breaking up components as variables, ie:

```
var title = rj`h1.component__title= this.props.title`

rj`
.component
  = title
`
```

```
var title = React.DOM.h1({ className: 'component__title ' }, this.props.title);

React.DOM.div({ className: 'component ' }, title);
```

### If Conditionals

If/Unless Conditionals are rendered as ternary statements.

```
.component
  if this.props.title
    h1.component__title= this.props.title
  else
    h2 No title Provided
```

```
React.DOM.div({ className: 'component ' },
  this.props.title
    ? React.DOM.h1({ className: 'component__title ' }, this.props.title)
    : React.DOM.h2({}, 'No title Provided')
);
```

Be aware that you can ONLY return a single element from an If or Else
Conditional:

```
.component
  if this.props.title
    h1.component__title= this.props.title
    h2 This won't render
  else
    div
      h1 These will both render
      h2 So Will This
```

```
React.DOM.div({ className: 'component ' },
  this.props.title
    ? React.DOM.h1({ className: 'component__title ' }, this.props.title)
    : React.DOM.div({},
        React.DOM.h1({}, 'These will both render'),
        React.DOM.h2({}, 'So Will This')
      )
);
```

### Case Conditionals

Cases created self calling functions that run a switch statement, so you can do
longer cases within your components.

```
case someVar.length
  when 0
    h1 Nothing Here
  when 1
    h1 One Thing Here
  default
    h1 Lots of things here
    h2 This will never be reached.
```

```
(function () {
    switch (someVar.length) {
    case 0:
        return React.DOM.h1({}, 'Nothing Here');
    case 1:
        return React.DOM.h1({}, 'One Thing Here');
    default:
        return React.DOM.h1({}, 'Lots of things here');
    }
}());
```

### Loops

`each` is supported as a standard map function. `while` is not supported.

```
ul.items
  each thing, ix in things
    li.item(key=ix)= thing
```

```
React.DOM.ul({ className: 'items ' },
  things.map(function (thing, ix) {
    return React.DOM.li({
        'key': ix,
        className: 'item '
    }, thing);
  })
);
```


### Calling Components

Just like JSX, you can call React Component Classes without a factory, by making
use of Jade's mixin syntax.

```
+Component(
  onClick=this.onClick
)
```

```
React.createElement(Component, { 'onClick': this.onClick });
```

Unlike DOM elements, you can provide a single argument as the properties,
allowing you to pass along props without writing out every single property.

```
+Component(_.assign(this.props, {
  "foo": "bar"
}))
```

```
React.createElement(Component, _.assign(this.props, { 'foo': 'bar' }));
```

Components take children same as elements.

```
+Component(onClick=this.onClick)
  p Some Children
  p Some More Children
```

```
React.createElement(Component, { 'onClick': this.onClick },
  React.DOM.p({}, 'Some Children'),
  React.DOM.p({}, 'Some More Children')
);
```

### &attributes

One of the limitations of Jade is that you can't provide single arguments to
DOM elements, for example:

```
div(propertiesObject)
```

...does not work, as the parser does not recognise it. The transformer supports
&attributes to allow you to pass an extra property object to a DOM element or
a component mixin:

```
+Component(onClick=this.onClick)&attributes(this.props)
  div&attributes({className: "blue")
  p Some More Children
```

```
React.createElement(Component, Object.assign({ 'onClick': this.onClick }, this.props),
  React.DOM.div({className: "blue"}),
  React.DOM.p({}, 'Some More Children')
);
```

This transformation makes use of the `Object.assign` functionality, so the
assumption is there that you'll shim Object.assign until Harmony is supported.
This feels like a safe shim to work with, unlikely to drift in functionality
from the specification.


### Unescaped HTML

Unescaped variables will be transformed into the standard property used for
React's unescaped HTML.

```
article.article
  section.article__content!= this.renderedHTML

 -- or --

article.article
  section.article__content
    != this.renderedHTML
```

```
React.DOM.article({
  className: "article"
}, React.DOM.section({
  dangerouslySetInnerHTML: {__html: this.renderedHTML}
});
```

Extra children can not be provided when using unescaped HTML.


### On the Roadmap

This is a pretty early implementation so I'm not sure when I'll consider it
'done'. Currently in use on some projects, I'm implementing things as I hit the
use case, so file an issue if you feel like something can clearly be added to
the transform. Things I can see coming:

- unescaped output turning into `{dangerouslySetInnerHtml: {__html: ""}}`
- propagating `this` inside map/switch statements
- ability to use variable assignment (this might be more complex than I want to
  support though, as we start building more closures and what not to make it
  work)


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
