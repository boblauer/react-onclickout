var assert          = require('assert')
  , jsdom           = require('jsdom')
  , React           = require('react')
  , ClickOutWrapper = require('../index.js')
  , clickedOutCount = 0
  ;

function incrementClickedOutCount() {
  clickedOutCount++;
}

describe('ClickOutWrapper', function () {
  beforeEach(function () {
    clickedOutCount = 0;
    global.document = jsdom.jsdom('<html><body></body></html>');
    global.window = document.parentWindow;
  });

  it('works as a wrapper component', function() {
    React.render(
    <ClickOutWrapper onClickOut={incrementClickedOutCount}>
      <span className='click-in'>Click in!</span>
    </ClickOutWrapper>, document.body);

    appendClickOutArea(document.body);

    testClicks();
  });

  it('cleans up handlers as a wrapper component', function() {
    React.render(
      <ClickOutWrapper onClickOut={incrementClickedOutCount}>
        <span className='click-in'>Click in!</span>
      </ClickOutWrapper>, document.body
    );

    appendClickOutArea(document.body);

    testClicks();

    var unmounted = React.unmountComponentAtNode(document.body);
    assert.equal(unmounted, true);

    appendClickOutArea(document.body);

    testUnmountedClicks();
  });

  it('works as a base class', function() {
    class Component extends ClickOutWrapper {
      onClickOut() {
        incrementClickedOutCount();
      }

      render() {
        return <span className='click-in'>Click in!</span>;
      }
    }

    React.render(React.createElement(Component), document.body);
    appendClickOutArea(document.body);

    testClicks();
  });

  it('cleans up as a base component', function() {
    class Component extends ClickOutWrapper {
      onClickOut() {
        incrementClickedOutCount();
      }

      render() {
        return <span className='click-in'>Click in!</span>;
      }
    }

    React.render(React.createElement(Component), document.body);
    appendClickOutArea(document.body);

    testClicks();

    var unmounted = React.unmountComponentAtNode(document.body);
    assert.equal(unmounted, true);

    appendClickOutArea(document.body);

    testUnmountedClicks();
  });
});

function testClicks() {
  var clickIn   = document.querySelector('.click-in')
    , clickOut  = document.querySelector('.click-out')
    , prevCount = clickedOutCount
    ;

  simulateClick(clickIn);
  assert.equal(clickedOutCount, prevCount);

  simulateClick(clickOut);
  assert.equal(clickedOutCount, prevCount + 1);
}

function testUnmountedClicks() {
  var clickOut  = document.querySelector('.click-out')
    , prevCount = clickedOutCount
    ;

  simulateClick(clickOut);
  assert.equal(clickedOutCount, prevCount);
}

function appendClickOutArea(parent) {
  var span = document.createElement('span');
  span.className = 'click-out';

  parent.appendChild(span);
}

function simulateClick(el) {
  var clickEvent = document.createEvent('MouseEvents');
  clickEvent.initEvent('click', true, true);
  el.dispatchEvent(clickEvent);
}
