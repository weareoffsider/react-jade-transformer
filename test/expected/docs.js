"use strict";

DOM.span({ className: 'spanClass ' });

DOM.div({
    'id': 'someId',
    'data-foo': 'bar',
    className: 'component '
});

DOM.div({ className: 'component ' + React.addons.classSet(classesObj) });

DOM.div({
    'style': { width: 234 },
    className: 'component '
});

DOM.div({
    'propsObj': true,
    className: 'component '
});

DOM.div({ className: 'component ' }, DOM.h1({ className: 'component__title ' }, 'This is the title'));

DOM.div({ className: 'component ' }, DOM.h1({ className: 'component__title ' }, this.props.title));

var title = DOM.h1({ className: 'component__title ' }, this.props.title);

DOM.div({ className: 'component ' }, title);

DOM.div({ className: 'component ' }, this.props.title ? DOM.h1({ className: 'component__title ' }, this.props.title) : DOM.h2({}, 'No title Provided'));

DOM.div({ className: 'component ' }, this.props.title ? DOM.h1({ className: 'component__title ' }, this.props.title) : DOM.div({}, DOM.h1({}, 'These will both render'), DOM.h2({}, 'So Will This')));

var caseStatement = function () {
    switch (someVar.length) {
    case 0:
        return DOM.h1({}, 'Nothing Here');
    case 1:
        return DOM.h1({}, 'One Thing Here');
    default:
        return DOM.h1({}, 'Lots of things here');
    }
}.bind(undefined)();

DOM.ul({ className: 'items ' }, things.map(function (thing, ix) {
    return DOM.li({
        'key': ix,
        className: 'item '
    }, thing);
}, undefined));

React.createElement(Component, { 'onClick': undefined.onClick });

React.createElement(Component, _.assign(this.props, { 'foo': 'bar' }));

React.createElement(Component, { 'onClick': undefined.onClick }, DOM.p({}, 'Some Children'), DOM.p({}, 'Some More Children'));