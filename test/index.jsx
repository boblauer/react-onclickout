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

    appendClickOutArea(container);

    testClicks(done);
  });

  it('works as a wrapper component with multiple children', function(done) {
    ReactDOM.render(
      <ClickOutWrapper onClickOut={incrementClickedOutCount}>
        <span className='click-in'>Click in!</span>
        <span className='click-in-2'>Click in!</span>
      </ClickOutWrapper>, container
    );

    appendClickOutArea(container);

    testClicks(done);
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

    appendClickOutArea(container);

    testMultipleInstanceClicks(done);
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
    simulateClick(container.querySelector('button'), function() {
      assert(!hideWasCalled);
      done();
    });
  });

  it('cleans up handlers as a wrapper component', function(done) {
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

      testUnmountedClicks(done);
    });

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
    appendClickOutArea(container);

    testClicks(done);
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
    appendClickOutArea(container);

    testClicks(function() {
      var unmounted = ReactDOM.unmountComponentAtNode(container);
      assert.equal(unmounted, true);

      appendClickOutArea(container);

      testUnmountedClicks(done);
    });
  });
});

function testClicks(done) {
  var clickIn   = document.querySelector('.click-in')
    , clickOut  = document.querySelector('.click-out')
    , prevCount = clickedOutCount
    ;

  simulateClick(clickIn, function() {
    assert.equal(clickedOutCount, prevCount);

    simulateClick(clickOut, function() {
      assert.equal(clickedOutCount, prevCount + 1);
      done();
    });
  });
}

function testMultipleInstanceClicks(done) {
  var clickIn1  = document.querySelector('.click-in')
    , clickIn2  = document.querySelector('.click-in-2')
    , clickOut  = document.querySelector('.click-out')
    , prevCount = clickedOutCount
    ;

  simulateClick(clickIn1, function() {
    assert.equal(clickedOutCount, prevCount + 1);

    simulateClick(clickIn2, function() {
      assert.equal(clickedOutCount, prevCount + 2);

      simulateClick(clickOut, function() {
        assert.equal(clickedOutCount, prevCount + 4);
        done();
      });
    });
  });
}

function testUnmountedClicks(done) {
  var clickOut  = document.querySelector('.click-out')
    , prevCount = clickedOutCount
    ;

  simulateClick(clickOut, function() {
    assert.equal(clickedOutCount, prevCount);
    done();
  });
}

function appendClickOutArea(parent) {
  var span = document.createElement('span');
  span.className = 'click-out';

  parent.appendChild(span);
}

function simulateClick(el, cb) {
  setTimeout(function() {
    var clickEvent = document.createEvent('MouseEvents');
    clickEvent.initEvent('click', true, true);
    el.dispatchEvent(clickEvent);
    cb();
  }, 0);
}
