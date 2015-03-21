var DataProperty = React.createClass({
  exampleProps: {
    title: "The Title",
    subtitle: "The Subtitle"
  },
  render: function() {
    var comProps = {
      "a": "Alpha",
      "b": "Beta",
      "c": "Charlie",
    };

    return rj`
      div.component.component--modifier(data-some-key=comProps.a)
        h3.component__title= this.props.title
        p= this.props.children
    `
  }
});
