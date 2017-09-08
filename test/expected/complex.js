"use strict";

var TestComponent = React.createClass({
  displayName: "TestComponent",

  exampleProps: {
    title: "The Title",
    subtitle: "The Subtitle"
  },
  render: function render() {
    var inserted = DOM.aside({ className: 'component__aside ' });
    var myClass = "component__extra";
    var things = ["one", "two", "three"];
    var someCase = "blue";

    return DOM.div({ className: 'component component--modifier component* ' }, DOM.h3({ className: 'component__title ' }, this.props.title), DOM.h4({ className: 'component__subtitle ' }, this.props.subtitle), DOM.p({ className: myClass }), DOM.p({}, 'Some hardcoded text.'), React.createElement(SomeOtherComponent, { 'variable': myClass }, DOM.h3({}, 'blah blah blah')), inserted, function () {
    switch (someCase) {
    case 'blue':
        return DOM.p({ className: 'blue ' }, 'Blue');
    case 'red':
        return DOM.p({ className: 'red ' }, 'Red');
    default:
        return DOM.p({ className: 'empty ' }, 'Is Empty');
    }
}.bind(this)(), !(things.length < 5) ? DOM.ul({ className: 'component__things ' }, things.map(function (thing, ix) {
    return DOM.li({
        'key': ix,
        className: 'component_thing '
    }, thing);
}, this)) : things.length > 0 ? DOM.p({ className: 'component__warning ' }, "You need more things! :(") : DOM.p({ className: 'component__warning ' }, "You got no things! :("));
  }
});