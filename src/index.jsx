'use strict';

const React = require('react');
const ReactDOM = require('react-dom');

class ClickOutComponent extends React.Component {

  constructor() {
    super();
  }

  componentDidMount() {
    let self = this;
    let elTouchIsClick = true;
    let documentTouchIsClick = true;
    let el = ReactDOM.findDOMNode(this);

    self.__documentTouchStarted = function(e) {
      el.removeEventListener('click', self.__elementClicked);
      document.removeEventListener('click', self.__documentClicked);
    }

    self.__documentTouchMoved = function(e) {
      documentTouchIsClick = false;
    };

    self.__documentTouchEnded = function(e) {
      if (documentTouchIsClick) self.__documentClicked(e);
      documentTouchIsClick = true;
    };

    self.__documentClicked = function(e) {
      if ((e.__clickedElements || []).indexOf(el) !== -1) return;

      let clickOutHandler = self.onClickOut || self.props.onClickOut;
      if (!clickOutHandler) {
        return console.warn('onClickOut is not defined.');
      }

      clickOutHandler.call(self, e);
    };

    self.__elementTouchMoved = function(e) {
      elTouchIsClick = false;
    };

    self.__elementTouchEnded = function(e) {
      if (elTouchIsClick) self.__elementClicked(e);
      elTouchIsClick = true;
    };

    self.__elementClicked = function(e) {
      e.__clickedElements = e.__clickedElements || [];
      e.__clickedElements.push(el);
    };

    setTimeout(function() {
      if (self.__unmounted) return;
      self.toggleListeners('addEventListener');
    }, 0);
  }

  toggleListeners(listenerMethod) {
    let el = ReactDOM.findDOMNode(this);

    el[listenerMethod]('touchmove', this.__elementTouchMoved);
    el[listenerMethod]('touchend', this.__elementTouchEnded);
    el[listenerMethod]('click', this.__elementClicked);

    document[listenerMethod]('touchstart', this.__documentTouchStarted);
    document[listenerMethod]('touchmove', this.__documentTouchMoved);
    document[listenerMethod]('touchend', this.__documentTouchEnded);
    document[listenerMethod]('click', this.__documentClicked);
  }

  componentWillUnmount() {
    this.toggleListeners('removeEventListener');
    this.__unmounted = true;
  }

  render() {
    return Array.isArray(this.props.children) ?
      <div>{this.props.children}</div> :
      React.Children.only(this.props.children);
  }
}

module.exports = ClickOutComponent
