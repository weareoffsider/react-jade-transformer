Atom.io 

Adding support for jade/pug syntax highlighting inside `rj` blocks
-----------------------------------------------------------------

You'll need the [react atom package](https://atom.io/packages/react) and a jade/pug syntax highlighter (doesn't matter which).

Install the packages and edit the react package. From Atom Settings choose packages, search 'react', then edit it from the list: Settings » View Code

In `react/grammars/Javascript (JSX).cson`:

```
'name': 'JavaScript (JSX)'
'scopeName': 'source.js.jsx'
'fileTypes': [
  'jsx',
  'react.js'
]
'patterns': [
  # ADD FROM HERE:
  {
    'begin': 'rj\\`'
    'end': '(.*?)`'
    'beginCaptures':
      '0':
        'name': 'punctuation.section.embedded.begin.rj'
    'endCaptures':
      '0':
        'name': 'punctuation.section.embedded.end.rj'
    'name': 'source.jade.embedded.rj'
    'patterns': [
      {
        'include': 'source.jade'
      }
    ]
  }
  # TO HERE
  {
    'include': '#pcdata'
  }
  # ...
```
