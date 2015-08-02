'use strict';
React.DOM.span({ className: 'spanClass ' });
React.DOM.div({
    'id': 'someId',
    'data-foo': 'bar',
    className: 'component '
});
React.DOM.div({ className: 'component ' + React.addons.classSet(classesObj) });
React.DOM.div({
    'style': { width: 234 },
    className: 'component '
});
React.DOM.div({
    'propsObj': true,
    className: 'component '
});
React.DOM.div({ className: 'component ' }, React.DOM.h1({ className: 'component__title ' }, 'This is the title'));
React.DOM.div({ className: 'component ' }, React.DOM.h1({ className: 'component__title ' }, this.props.title));
var title = React.DOM.h1({ className: 'component__title ' }, this.props.title);
React.DOM.div({ className: 'component ' }, title);
React.DOM.div({ className: 'component ' }, this.props.title ? React.DOM.h1({ className: 'component__title ' }, this.props.title) : React.DOM.h2({}, 'No title Provided'));
React.DOM.div({ className: 'component ' }, this.props.title ? React.DOM.h1({ className: 'component__title ' }, this.props.title) : React.DOM.div({}, React.DOM.h1({}, 'These will both render'), React.DOM.h2({}, 'So Will This')));
(function () {
    switch (someVar.length) {
    case 0:
        return React.DOM.h1({}, 'Nothing Here');
    case 1:
        return React.DOM.h1({}, 'One Thing Here');
    default:
        return React.DOM.h1({}, 'Lots of things here');
    }
}.bind(undefined)());
React.DOM.ul({ className: 'items ' }, things.map(function (thing, ix) {
    return React.DOM.li({
        'key': ix,
        className: 'item '
    }, thing);
}, undefined));
React.createElement(Component, { 'onClick': this.onClick });
React.createElement(Component, _.assign(this.props, { 'foo': 'bar' }));
React.createElement(Component, { 'onClick': this.onClick }, React.DOM.p({}, 'Some Children'), React.DOM.p({}, 'Some More Children'));