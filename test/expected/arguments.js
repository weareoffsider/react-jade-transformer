'use strict';
var ArgumentsComponent = React.createClass({
    displayName: 'ArgumentsComponent',
    exampleProps: {
        title: 'The Title',
        subtitle: 'The Subtitle'
    },
    render: function render() {
        var comProps = {
            a: 'Alpha',
            b: 'Beta',
            c: 'Charlie'
        };
        return React.DOM.div({ className: 'component component--modifier ' }, React.DOM.h3({ className: 'component__title ' }, this.props.title), React.DOM.p({}, this.props.children), React.createElement(SomeComponent, _.assign(comProps, { 'd': 'delta' })));
    }
});