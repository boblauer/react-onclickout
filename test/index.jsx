var assert          = require('assert')
  , jsdom           = require('jsdom')
  , React           = require('react')
  , ReactDOM        = require('react-dom')
  , ClickOutWrapper = require('../index.js')
  , clickedOutCount = 0
  ;

function incrementClickedOutCount() {
  clickedOutCount++;
}

describe('ClickOutWrapper', function () {
  var container;

  beforeEach(function () {
    clickedOutCount = 0;
    global.document = jsdom.jsdom('<html><body><div id="container"></div></body></html>');
    global.window = document.parentWindow;
    container = global.document.querySelector('#container');
  });

  it('works as a wrapper component', function(done) {
    ReactDOM.render(
      <ClickOutWrapper onClickOut={incrementClickedOutCount}>
        <span className='click-in'>Click in!</span>
      </ClickOutWrapper>, container
    );

    setTimeout(function() {
      appendClickOutArea(container);
      testClicks();
      done();
    }, 0);
  });

  it('works as a wrapper component with multiple children', function(done) {
    ReactDOM.render(
      <ClickOutWrapper onClickOut={incrementClickedOutCount}>
        <span className='click-in'>Click in!</span>
        <span className='click-in-2'>Click in!</span>
      </ClickOutWrapper>, container
    );

    setTimeout(function() {
      appendClickOutArea(container);

      testClicks();
      done();
    }, 0);
  })

  it('works with multiple instances at once', function(done) {
    ReactDOM.render(
      <div>
        <ClickOutWrapper onClickOut={incrementClickedOutCount}>
          <span className='click-in'>Click in!</span>
        </ClickOutWrapper>
        <ClickOutWrapper onClickOut={incrementClickedOutCount}>
          <span className='click-in-2'>Click in!</span>
        </ClickOutWrapper>
      </div>, container
    );

    setTimeout(function() {
      appendClickOutArea(container);

      testMultipleInstanceClicks();
      done();
    }, 0);
  });

  it('cleans up handlers as a wrapper component', function(done) {
    ReactDOM.render(
      <ClickOutWrapper onClickOut={incrementClickedOutCount}>
        <span className='click-in'>Click in!</span>
      </ClickOutWrapper>, container
    );

    setTimeout(function() {
      appendClickOutArea(container);

      testClicks();

      var unmounted = ReactDOM.unmountComponentAtNode(container);
      assert.equal(unmounted, true);

      appendClickOutArea(container);

      testUnmountedClicks();
      done();
    }, 0);
  });

  it('works as a base class', function(done) {
    class Component extends ClickOutWrapper {
      onClickOut() {
        incrementClickedOutCount();
      }

      render() {
        return <span className='click-in'>Click in!</span>;
      }
    }

    ReactDOM.render(React.createElement(Component), container);

    setTimeout(function() {
      appendClickOutArea(container);

      testClicks();
      done();
    }, 0);
  });

  it('cleans up as a base component', function(done) {
    class Component extends ClickOutWrapper {
      onClickOut() {
        incrementClickedOutCount();
      }

      render() {
        return <span className='click-in'>Click in!</span>;
      }
    }

    ReactDOM.render(React.createElement(Component), container);

    setTimeout(function() {
      appendClickOutArea(container);

      testClicks();

      var unmounted = ReactDOM.unmountComponentAtNode(container);
      assert.equal(unmounted, true);

      appendClickOutArea(container);

      testUnmountedClicks();
      done();
    }, 0);
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
