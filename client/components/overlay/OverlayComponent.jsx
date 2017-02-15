const React = require('react');

const OverlayStore   = require('../../stores/OverlayStore.js').default,
      OverlayActions = require('../../actions/OverlayActions.js');

function getOverlayState () {
  return OverlayStore.getOverlay();
}

const OverlayDisplay = React.createClass({
  getInitialState: function() {
    return {
      overlay: getOverlayState()
    }
  },
  updateState: function() {
    this.setState({
      overlay: getOverlayState()
    });
  },
  componentWillMount: function () {
    OverlayStore.on("change", this._onChange);
  },
  componentWillUnmount: function () {
    OverlayStore.removeListener("change", this._onChange);
  },
  render: function() {
    var overlayClassName = (this.state.overlay) ? "overlay visible" : "overlay hidden";
    return(
      <div id='overlay-display'>
        <div className={overlayClassName}>
          <div id="loading-spinner-container">
            <span id="loading-spinner" className="spinner" />
          </div>
        </div>
      </div>
    )
  },
  _onChange: function () {
    this.updateState();
  }
});

export default OverlayDisplay;
