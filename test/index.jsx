var assert          = require('assert')
  , jsdom           = require('jsdom')
  , React           = require('react')
  , ReactDOM        = require('react-dom')
  , sinon           = require('sinon')
  , ClickOutWrapper = require('../index.js')
  , clickedOutCount = 0
  ;

function incrementClickedOutCount(count) {
  if (typeof count !== 'number') count = 1;
  clickedOutCount += count;
}

describe('ClickOutWrapper', function () {
  var container;

  beforeEach(function() {
    sinon.stub(global, 'setTimeout', function(cb) {
      cb();
    });
  });

  afterEach(function() {
    if (setTimeout.restore) {
      setTimeout.restore();
    }
  });

  beforeEach(function () {
    clickedOutCount = 0;
    global.document = jsdom.jsdom('<html><body><div id="container"></div></body></html>');
    global.window = document.parentWindow;
    container = global.document.querySelector('#container');
  });

  it('works as a wrapper component', function() {
    ReactDOM.render(
      <ClickOutWrapper onClickOut={incrementClickedOutCount}>
        <span className='click-in'>Click in!</span>
      </ClickOutWrapper>, container
    );

    appendClickOutArea(container);

    testClicks();
  });

  it('works as a wrapper component with multiple children', function() {
    ReactDOM.render(
      <ClickOutWrapper onClickOut={incrementClickedOutCount}>
        <span className='click-in'>Click in!</span>
        <span className='click-in-2'>Click in!</span>
      </ClickOutWrapper>, container
    );

    appendClickOutArea(container);

    testClicks();
  })

  it('works with multiple instances at once', function() {
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

    appendClickOutArea(container);

    testMultipleInstanceClicks();
  });

  it('works when adding the click-out component on click of the page', function(done) {
    var hideWasCalled = false;

    class Component extends React.Component {
      constructor() {
        super();
        this.state = { modalVisible: false }
      }

      showModal() {
        this.setState({ modalVisible: true });
      }

      hideModal() {
        hideWasCalled = true;
        this.setState({ modalVisible: false });
      }

      render() {
        var el = this.state.modalVisible ?
          <ClickOutWrapper onClickOut={this.hideModal.bind(this)}><span>I am a modal!</span></ClickOutWrapper> :
          <button onClick={this.showModal.bind(this)}>Show Modal!</button>;

        return el;
      }
    }

    ReactDOM.render(React.createElement(Component), container);
    setTimeout.restore();
    setTimeout(function() {
      simulateClick(container.querySelector('button'));
      assert(!hideWasCalled);
      done();
    }, 1);
  });

  it('cleans up handlers as a wrapper component', function() {
    ReactDOM.render(
      <ClickOutWrapper onClickOut={incrementClickedOutCount}>
        <span className='click-in'>Click in!</span>
      </ClickOutWrapper>, container
    );

    appendClickOutArea(container);

    testClicks(function() {
      var unmounted = ReactDOM.unmountComponentAtNode(container);
      assert.equal(unmounted, true);

      appendClickOutArea(container);

      testUnmountedClicks();
    });
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

    ReactDOM.render(React.createElement(Component), container);
    appendClickOutArea(container);

    testClicks();
  });

  it('does not fire a click on itself when it is nested inside another click-out component', function() {
    ReactDOM.render(
      <div>
        <ClickOutWrapper onClickOut={incrementClickedOutCount}>
          <div className='outer-click-area'>Click in!</div>
          <ClickOutWrapper onClickOut={incrementClickedOutCount.bind(null, 2)}>
            <span className='inner-click-area'>Click in!</span>
          </ClickOutWrapper>
        </ClickOutWrapper>
      </div>, container
    );

    var outerClickArea = document.querySelector('.outer-click-area')
      , innerClickArea = document.querySelector('.inner-click-area')
      , prevCount = clickedOutCount
      ;

    simulateClick(outerClickArea);
    assert.equal(clickedOutCount, prevCount + 2);

    simulateClick(innerClickArea);
    assert.equal(clickedOutCount, prevCount + 2);
  })

  it('cleans up as a base component', function() {
    class Component extends ClickOutWrapper {
      onClickOut() {
        incrementClickedOutCount();
      }

      render() {
        return <span className='click-in'>Click in!</span>;
      }
    }

    ReactDOM.render(React.createElement(Component), container);
    appendClickOutArea(container);

    testClicks();
    var unmounted = ReactDOM.unmountComponentAtNode(container);
    assert.equal(unmounted, true);

    appendClickOutArea(container);

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
