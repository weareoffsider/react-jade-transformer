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

    return DOM.div(Object.assign({
    'hello': 'imaprop',
    className: 'component component--modifier '
}, this.props));
  }
});