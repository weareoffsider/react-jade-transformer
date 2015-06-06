'use strict';
var ArgumentsComponent = React.createClass({
    displayName: 'ArgumentsComponent',
    exampleProps: { title: 'The Title' },
    render: function render() {
        return React.DOM.section({ className: 'component ' }, React.DOM.div({
            className: 'component__content ',
            dangerouslySetInnerHTML: { __html: this.escapedHTML }
        }), React.DOM.div({
            className: 'component__content ',
            dangerouslySetInnerHTML: { __html: this.escapedHTMLTwo }
        }));
    }
});