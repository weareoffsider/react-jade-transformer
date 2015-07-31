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
        h3.component__title(
          title="**" + this.props.title + "**"
        )
        p&attributes({className: "blue"})= this.props.children
        +SomeComponent(comProps)&attributes(this.props)
    `
  }
});
