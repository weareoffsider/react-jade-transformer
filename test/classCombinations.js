var ClassCombinations = React.createClass({
  exampleProps: {
    title: "The Title",
    subtitle: "The Subtitle"
  },
  render: function() {
    var classy = {
      "component--modifier": true
    };


    return rj`
      div.component(class=React.addons.classSet(classy))
        .handlebars(style={"width": 234})
        h3.component__title= this.props.title
        p= this.props.children
    `
  }
});
