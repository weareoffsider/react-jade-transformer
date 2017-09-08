"use strict";

var ArgumentsComponent = React.createClass({
  displayName: "ArgumentsComponent",

  exampleProps: {
    title: "The Title",
    subtitle: "The Subtitle"
  },
  render: function render() {
    var comProps = {
      a: "Alpha",
      b: "Beta",
      c: "Charlie"
    };

    return DOM.div({ className: 'component component--modifier ' }, DOM.h3({ className: 'component__title ' }, this.props.title), DOM.p({ className: 'blue' }, this.props.children), React.createElement(SomeComponent, Object.assign(comProps, this.props)));
  }
});
