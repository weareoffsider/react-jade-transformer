"use strict";

var ClassCombinations = React.createClass({
  displayName: "ClassCombinations",

  exampleProps: {
    title: "The Title",
    subtitle: "The Subtitle"
  },
  render: function render() {
    var classy = {
      "component--modifier": true
    };

    return DOM.div({ className: 'component ' + React.addons.classSet(classy) }, DOM.div({
    'style': { 'width': 234 },
    className: 'handlebars '
}), DOM.h3({ className: 'component__title ' }, this.props.title), DOM.p({}, this.props.children));
  }
});