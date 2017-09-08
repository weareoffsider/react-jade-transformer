"use strict";

var ArgumentsComponent = React.createClass({
  displayName: "ArgumentsComponent",

  exampleProps: {
    title: "The Title"
  },
  render: function render() {
    return DOM.section({ className: 'component ' }, DOM.div({
    className: 'component__content ',
    dangerouslySetInnerHTML: { __html: this.escapedHTML }
}), DOM.div({
    className: 'component__content ',
    dangerouslySetInnerHTML: { __html: this.escapedHTMLTwo }
}));
  }
});