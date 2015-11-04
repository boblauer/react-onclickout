'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var ReactDOM = require('react-dom');

var ClickOutComponent = (function (_React$Component) {
  _inherits(ClickOutComponent, _React$Component);

  function ClickOutComponent() {
    _classCallCheck(this, ClickOutComponent);

    _get(Object.getPrototypeOf(ClickOutComponent.prototype), 'constructor', this).call(this);
  }

  _createClass(ClickOutComponent, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var self = this,
          el = ReactDOM.findDOMNode(this),
          reactId = el.getAttribute('data-reactid');

      self.__windowListener = function (e) {
        if (e.__clickInElReactId === reactId) return;

        var clickOutHandler = self.onClickOut || self.props.onClickOut;
        if (!clickOutHandler) {
          return console.warn('onClickOut is not defined.');
        }

        clickOutHandler.call(self, e);
      };

      self.__elementListener = function (e) {
        e.__clickInElReactId = reactId;
      };

      setTimeout(function () {
        window.addEventListener('click', self.__windowListener);
        el.addEventListener('click', self.__elementListener);
      }, 0);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      window.removeEventListener('click', this.__windowListener);
      ReactDOM.findDOMNode(this).removeEventListener('click', this.__elementListener);
    }
  }, {
    key: 'render',
    value: function render() {
      return Array.isArray(this.props.children) ? React.createElement(
        'div',
        null,
        this.props.children
      ) : React.Children.only(this.props.children);
    }
  }]);

  return ClickOutComponent;
})(React.Component);

module.exports = ClickOutComponent;
