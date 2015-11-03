'use strict';

const React = require('react');
const ReactDOM = require('react-dom');

class ClickOutComponent extends React.Component {

  constructor() {
    super();
  }

  componentDidMount() {
    let self    = this
      , el      = ReactDOM.findDOMNode(this)
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

    // Delay adding click handlers to prevent being triggered by the click that 
    // caused it to be mounted in the first place.
    setTimeout(function() {
      window.addEventListener('click', self.__windowListener);
      el.addEventListener('click', self.__elementListener);
    }, 0);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.__windowListener);
    ReactDOM.findDOMNode(this).removeEventListener('click', this.__elementListener);
  }

  render() {
    return Array.isArray(this.props.children) ?
      <div>{this.props.children}</div> :
      React.Children.only(this.props.children);
  }
}

module.exports = ClickOutComponent
