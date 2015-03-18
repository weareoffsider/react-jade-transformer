var TestComponent = React.createClass({
  exampleProps: {
    title: "The Title",
    subtitle: "The Subtitle"
  },
  render: function() {
    var inserted = rj`aside.component__aside`;
    var myClass = "component__extra";
    var things = ["one", "two", "three"];

    var someTernary = "eoanth" ? "eoanth" : null;

    var someCase = "blue";

    (function(){ switch (someCase) {
      case "blue":
      return rj`aside.internal__component`;

      case "red":
      return React.DOM.p({className: "red"});

      default:
      return React.DOM.p({className: "empty"});
    }})();

    if (true) {
      return rj`
        div.component.component--modifier(class="component*")
          h3.component__title= this.props.title
          h4.component__subtitle= this.props.subtitle
          p(class=myClass)
          p Some hardcoded text.
          +SomeOtherComponent(variable=myClass)
            h3 blah blah blah
          = inserted
          if things.length > 0
            ul.component__things
              each thing, ix in things
                li.component_thing(key=ix)= thing
          else
            p.component__warning= "You got no things! :("
          case someCase
            when "blue"
              p.blue Blue
            when "red"
              p.red Red
            default
              p.empty Is Empty

      `
    };
  }
});
