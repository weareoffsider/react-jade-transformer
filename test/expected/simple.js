"use strict";

var SimpleComponent = React.createClass({
  displayName: "SimpleComponent",

  exampleProps: {
    title: "The Title",
    subtitle: "The Subtitle"
  },
  render: function render() {
    return DOM.div({ className: 'component component--modifier ' }, DOM.h3({ className: 'component__title ' }, this.props.title), DOM.p({}, this.props.children));
  }
});