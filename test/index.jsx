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
      </ClickOutWrapper>, document.body
    );

    appendClickOutArea(document.body);

    testClicks();
  });

  it('works as a wrapper component with multiple children', function() {
    React.render(
      <ClickOutWrapper onClickOut={incrementClickedOutCount}>
        <span className='click-in'>Click in!</span>
        <span className='click-in-2'>Click in!</span>
      </ClickOutWrapper>, document.body
    );

    appendClickOutArea(document.body);

    testClicks();
  })

  it('works with multiple instances at once', function() {
    React.render(
      <div>
        <ClickOutWrapper onClickOut={incrementClickedOutCount}>
          <span className='click-in'>Click in!</span>
        </ClickOutWrapper>
        <ClickOutWrapper onClickOut={incrementClickedOutCount}>
          <span className='click-in-2'>Click in!</span>
        </ClickOutWrapper>
      </div>, document.body
    );

    appendClickOutArea(document.body);

    testMultipleInstanceClicks();
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

function testMultipleInstanceClicks() {
  var clickIn1  = document.querySelector('.click-in')
    , clickIn2  = document.querySelector('.click-in-2')
    , clickOut  = document.querySelector('.click-out')
    , prevCount = clickedOutCount
    ;

  simulateClick(clickIn1);
  assert.equal(clickedOutCount, prevCount + 1);

  simulateClick(clickIn2);
  assert.equal(clickedOutCount, prevCount + 2);

  simulateClick(clickOut);
  assert.equal(clickedOutCount, prevCount + 4);
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
