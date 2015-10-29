"use strict";

var ArgumentsComponent = React.createClass({
  displayName: "ArgumentsComponent",

  exampleProps: {
    title: "The Title",
    subtitle: "The Subtitle"
  },

  eventHandler: function eventHandler(e) {
    console.log(e.type);
  },

  render: function render() {
    var _this = this;

    var subComponents = this.props.things.map(function (thing, ix) {
      return React.DOM.div({
    'onClick': _this.eventHandler,
    'style': { width: _this.getWidth(_this) },
    'title': 'Some title ' + thing + ' testing concat inside',
    'data-comp': _this.getInformation(_this),
    'key': ix,
    className: 'subComponent '
}, thing);
    });

    return React.DOM.div({ className: 'component ' }, subComponents);
  }
});