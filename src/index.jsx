'use strict';

const React = require('react');

class ClickOutComponent extends React.Component {

  constructor() {
    super();
  }

  componentDidMount() {
    var self = this;

    window.addEventListener('click', function(e) {
      if (e.__isClickIn) return;

      var clickOutHandler = self.onClickOut || self.props.onClickOut;
      if (!clickOutHandler) {
        return console.warn('onClickOut is not defined.');
      }

      clickOutHandler.call(self, e);
    });

    React.findDOMNode(this).addEventListener('click', function(e) {
      e.__isClickIn = true;
    });
  }

  render() {
    return <div>{this.props.children}</div>;
  }
}

module.exports = ClickOutComponent
