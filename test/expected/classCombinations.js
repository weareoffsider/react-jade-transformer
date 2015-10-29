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

    return React.DOM.div({ className: 'component ' + React.addons.classSet(classy) }, React.DOM.div({
    'style': { 'width': 234 },
    className: 'handlebars '
}), React.DOM.h3({ className: 'component__title ' }, this.props.title), React.DOM.p({}, this.props.children));
  }
});