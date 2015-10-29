"use strict";

var ArgumentsComponent = React.createClass({
  displayName: "ArgumentsComponent",

  exampleProps: {
    title: "The Title",
    subtitle: "The Subtitle"
  },
  render: function render() {
    var comProps = {
      "a": "Alpha",
      "b": "Beta",
      "c": "Charlie"
    };

    return React.DOM.div({ className: 'component component--modifier ' }, React.DOM.h3({
    'title': '**' + this.props.title + '**',
    className: 'component__title '
}), React.DOM.p({ className: 'blue' }, this.props.children), React.createElement(SomeComponent, Object.assign(comProps, this.props)));
  }
});