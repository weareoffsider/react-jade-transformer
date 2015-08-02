var ArgumentsComponent = React.createClass({
  exampleProps: {
    title: "The Title",
    subtitle: "The Subtitle"
  },

  eventHandler: function(e){
    console.log(e.type);
  },

  render: function() {
    var subComponents = this.props.things.map((thing, ix) => {
      return rj`
        .subComponent(
          onClick=this.eventHandler
          style={width: this.getWidth(this)}
          title="Some title " + thing + " testing concat inside"
          data-comp=this.getInformation(this)
          key=ix
        )= thing
      `
    });

    return rj`
      div.component= subComponents
    `
  }
});
