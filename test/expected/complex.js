'use strict';
var TestComponent = React.createClass({
    displayName: 'TestComponent',
    exampleProps: {
        title: 'The Title',
        subtitle: 'The Subtitle'
    },
    render: function render() {
        var inserted = React.DOM.aside({ className: 'component__aside ' });
        var myClass = 'component__extra';
        var things = [
            'one',
            'two',
            'three'
        ];
        var someCase = 'blue';
        return React.DOM.div({ className: 'component component--modifier component* ' }, React.DOM.h3({ className: 'component__title ' }, this.props.title), React.DOM.h4({ className: 'component__subtitle ' }, this.props.subtitle), React.DOM.p({ className: myClass }), React.DOM.p({}, 'Some hardcoded text.'), React.createElement(SomeOtherComponent, { 'variable': myClass }, React.DOM.h3({}, 'blah blah blah')), inserted, function () {
            switch (someCase) {
            case 'blue':
                return React.DOM.p({ className: 'blue ' }, 'Blue');
            case 'red':
                return React.DOM.p({ className: 'red ' }, 'Red');
            default:
                return React.DOM.p({ className: 'empty ' }, 'Is Empty');
            }
        }(), !(things.length < 5) ? React.DOM.ul({ className: 'component__things ' }, things.map(function (thing, ix) {
            return React.DOM.li({
                'key': ix,
                className: 'component_thing '
            }, thing);
        })) : things.length > 0 ? React.DOM.p({ className: 'component__warning ' }, "You need more things! :(") : React.DOM.p({ className: 'component__warning ' }, "You got no things! :("));
    }
});