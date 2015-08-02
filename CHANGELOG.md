# Change Log

All notable changes to this project will be documented in this file.

## Unreleased Changes

## 0.4.0 - 2015-08-03
### Added
- `this` is now bound (using Function.bind) to switch and map function
  expressions (kinda embarrasing I didn't think of it sooner).
- `this` is now added to the preparation step's string, which allows it to be
  tracked even if an intermediate step assigns `this` to another variable (any
  fat arrow transpiler does this when targeting ES5)

## 0.3.1 - 2015-07-31
### Fixed
- Fixed incorrect literal detection for jade attributes that are string
  concatenations, for example:

  a(
    title="Prefix " + this.props.value + " Suffix"
  )

## 0.3.0 - 2015-06-06
### Added
- Added support for &attributes for DOM elements and Components
- Added support for unescaped HTML for DOM elements.

## 0.2.0 - 2015-03-23
### Added
- Basic File Diff Tests
- Documentation Reference

## 0.1.12 - 2015-03-21
### Fixed
- Fixed regression introduced, literals incorrectly build for code generator.

## 0.1.11 - 2015-03-21
### Added
- String Classes and Calculated Classes (ie React.addons.classSet) can now
  be safely mixed.
- Object Literals can be used as attributes.
- Components Argument can now be used in place of attribute properties, for
  example: +Component(propsObject)

### Fixed
- Properties written as Literals rather than Identifier, so you can now use
  attributes such as "data-foo".

## 0.1.10 - 2015-03-21
### Fixed
- Fixed Switch Statements outputting a semicolon mid statement.

## 0.1.9 - 2015-03-20
### Fixed
- Fix lone 'if's crashing code generator.

## 0.1.8 - 2015-03-20
### Fixed
- Fix non else expression following lone 'if' clause in Jade

## 0.1.7 - 2015-03-20
### Fixed
- More handler expressions for parsing.

## 0.1.6 - 2015-03-20
### Fixed
- Added further handler expressions, closing out more misses in final pass.

## 0.1.5 - 2015-03-20
### Fixed
- Added handling for further expressions in analysing code, no longer misses
  calls within for statements.

## 0.1.4 - 2015-03-19
### Added
- Support for Unless/Else If

## 0.1.3 - 2015-03-18
### Added
- Support for If/Else, Switch
- JS Traversal now goes into If/Else, Switch statements.

## 0.1.2 - 2015-03-18
### Fixed
- Added blank block check for Jade blocks.

## 0.1.1 - 2015-03-18
### Fixed
- Tree walker null checks (for blank files)

## 0.1.0 - 2015-03-18
### Added
- Initial release.
- Gulp plugin.
- Browserify Transform plugin.
- Supports:
  - Elements
  - Mixins as Components
  - Buffered Output
  - Each/For
  - Classes
