'use strict';
var SimpleComponent = React.createClass({
    displayName: 'SimpleComponent',
    exampleProps: {
        title: 'The Title',
        subtitle: 'The Subtitle'
    },
    render: function render() {
        return React.DOM.div({ className: 'component component--modifier ' }, React.DOM.h3({ className: 'component__title ' }, this.props.title), React.DOM.p({}, this.props.children));
    }
});