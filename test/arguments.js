var ArgumentsComponent = React.createClass({
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
      div.component.component--modifier
        h3.component__title= this.props.title
        p= this.props.children
        +SomeComponent(_.assign(comProps, {"d": "delta"}))
    `
  }
});
