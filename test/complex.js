var TestComponent = React.createClass({
  exampleProps: {
    title: "The Title",
    subtitle: "The Subtitle"
  },
  render: function() {
    var inserted = rj`aside.component__aside`;
    var myClass = "component__extra";
    var things = ["one", "two", "three"];

    return rj`
      div.component.component--modifier(class="component*")
        h3.component__title= this.props.title
        h4.component__subtitle= this.props.subtitle
        p(class=myClass)
        p Some hardcoded text.
        +SomeOtherComponent(variable=myClass)
          h3 blah blah blah
        = inserted
        ul.component__things
          each thing, ix in things
            li.component_thing(key=ix)= thing
    `
  }
});
