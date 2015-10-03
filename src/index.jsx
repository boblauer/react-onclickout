'use strict';

const React = require('react');

class ClickOutComponent extends React.Component {

  constructor() {
    super();
  }

  componentDidMount() {
    let self    = this
      , el      = React.findDOMNode(this)
      , reactId = el.getAttribute('data-reactid')
      ;

    self.__windowListener = function(e) {
      if (e.__isClickIn === reactId) return;

      var clickOutHandler = self.onClickOut || self.props.onClickOut;
      if (!clickOutHandler) {
        return console.warn('onClickOut is not defined.');
      }

      clickOutHandler.call(self, e);
    };

    self.__elementListener = function(e) {
      e.__isClickIn = reactId;
    };

    window.addEventListener('click', self.__windowListener);
    el.addEventListener('click', self.__elementListener);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.__windowListener);
    React.findDOMNode(this).removeEventListener('click', this.__elementListener);
  }

  render() {
    return Array.isArray(this.props.children) ?
      <div>{this.props.children}</div> :
      React.Children.only(this.props.children);
  }
}

module.exports = ClickOutComponent
