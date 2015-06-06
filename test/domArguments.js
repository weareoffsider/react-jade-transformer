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
      div.component.component--modifier(
        hello="imaprop"
      )&attributes(this.props)
    `
  }
});
