var ArgumentsComponent = React.createClass({
  exampleProps: {
    title: "The Title",
  },
  render: function() {
    return rj`
      section.component
        div.component__content
          != this.escapedHTML
        div.component__content!= this.escapedHTMLTwo
    `
  }
});
