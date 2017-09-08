"use strict";

var DataProperty = React.createClass({
  displayName: "DataProperty",

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

    return DOM.div({
    'data-some-key': comProps.a,
    className: 'component component--modifier '
}, DOM.h3({ className: 'component__title ' }, this.props.title), DOM.p({}, this.props.children));
  }
});