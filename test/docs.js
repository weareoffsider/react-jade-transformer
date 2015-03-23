rj`
span.spanClass
`;


rj`
.component#someId(data-foo="bar")
`

rj`
.component(class=React.addons.classSet(classesObj))
`

rj`
.component(style={width: 234})
`

rj`
.component(propsObj)
`

rj`
.component
  h1.component__title This is the title
`

rj`
.component
  h1.component__title= this.props.title
`

var title = rj`h1.component__title= this.props.title`

rj`
.component
  = title
`

rj`
.component
  if this.props.title
    h1.component__title= this.props.title
  else
    h2 No title Provided
`

rj`
.component
  if this.props.title
    h1.component__title= this.props.title
    h2 This won't render
  else
    div
      h1 These will both render
      h2 So Will This
`

rj`
case someVar.length
  when 0
    h1 Nothing Here
  when 1
    h1 One Thing Here
  default
    h1 Lots of things here
`


rj`
ul.items
  each thing, ix in things
    li.item(key=ix)= thing
`

rj`
+Component(
  onClick=this.onClick
)
`

rj`
+Component(_.assign(this.props, {
  "foo": "bar"
}))
`

rj`
+Component(onClick=this.onClick)
  p Some Children
  p Some More Children
`
