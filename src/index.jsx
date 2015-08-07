'use strict';

const React = require('react');

class ClickOutComponent extends React.Component {

  constructor() {
    super();
  }

  componentDidMount() {
    var self = this;

    self.__windowListener = function(e) {
      if (e.__isClickIn) return;

      var clickOutHandler = self.onClickOut || self.props.onClickOut;
      if (!clickOutHandler) {
        return console.warn('onClickOut is not defined.');
      }

      clickOutHandler.call(self, e);
    };

    self.__elementListener = function(e) {
      e.__isClickIn = true;
    };

    window.addEventListener('click', self.__windowListener);
    React.findDOMNode(this).addEventListener('click', self.__elementListener);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.__windowListener);
    React.findDOMNode(this).removeEventListener('click', this.__elementListener);
  }

  render() {
    return <div>{this.props.children}</div>;
  }
}

module.exports = ClickOutComponent
