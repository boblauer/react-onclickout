# An ES6-friendly on-click-outside React component.

This is a React component that can be used to listen for clicks outside of a given component.  As an example, you may need to hide a menu when a user clicks elsewhere on the page.

This component was created specifically to support ES6-style React components.  If you want to use a mixin instead, I would recommend the [react-onclickoutside](https://github.com/Pomax/react-onclickoutside) mixin.

## Installation

```
npm install react-onclickout --save
```

## React Version Support

For React `0.14` or later, use version `2.x` of this package.  For React `0.13` or earlier, use version `1.x` of this package.

## Usage

There are two ways to use this component.

### As a wrapper component

```jsx
const ClickOutHandler = require('react-onclickout');

class ExampleComponent extends React.Component {

  onClickOut(e) {
    alert('user clicked outside of the component!');
  }

  render() {
    return (
      <ClickOutHandler onClickOut={this.onClickOut}>
        <div>Click outside of me!</div>
      </ClickOutHandler>
    );
  }
}
```

### As a base component

```jsx
const ClickOutComponent = require('react-onclickout');

class ExampleComponent extends ClickOutComponent {

  onClickOut(e) {
    alert('user clicked outside of the component!');
  }

  render() {
    return (
      <div>Click outside of me!</div>
    );
  }
}
```

## Ignoring Elements

There are times when you may want to ignore certain elements that were clicked outside of the target component.  You can handle such a scenario by inspecting the event passed to your `onClickOut` method handler.

```jsx
const ClickOutHandler = require('react-onclickout');

class ExampleComponent extends React.Component {

  onClickOut(e) {
    if (hasClass(e.target, 'ignore-me')) return;
    alert('user clicked outside of the component!');
  }

  render() {
    return (
      <ClickOutHandler onClickOut={this.onClickOut}>
        <div>Click outside of me!</div>
      </ClickOutHandler>
    );
  }
}
```

That's pretty much it.  Pull requests are more than welcome!
