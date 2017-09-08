declare var SomeOtherComponent: any;
declare var React: any;
declare var DOM: any;

const TestComponent = React.createClass({
  exampleProps: {
    title: "The Title",
    subtitle: "The Subtitle"
  },
  render: function() {
    var inserted = rj`aside.component__aside`;
    var myClass = "component__extra";
    var things = ["one", "two", "three"];
    var someCase = "blue";

    return rj`
      div.component.component--modifier(class="component*")
        h3.component__title= this.props.title
        h4.component__subtitle= this.props.subtitle
        p(class=myClass)
        p Some hardcoded text.
        +SomeOtherComponent(variable=myClass)
          h3 blah blah blah
        = inserted

        case someCase
          when "blue"
            p.blue Blue
          when "red"
            p.red Red
          default
            p.empty Is Empty

        unless things.length < 5
          ul.component__things
            each thing, ix in things
              li.component_thing(key=ix)= thing
        else if things.length > 0
          p.component__warning= "You need more things! :("
        else
          p.component__warning= "You got no things! :("

    `;
  }
});
