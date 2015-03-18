var SimpleComponent = React.createClass({
  exampleProps: {
    title: "The Title",
    subtitle: "The Subtitle"
  },
  render: function() {
    return rj`
      div.component.component--modifier
        h3.component__title= this.props.title
        p= this.props.children
    `
  }
});
