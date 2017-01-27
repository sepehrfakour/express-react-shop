const React = require('react');

const Alert = require('./AlertComponent.jsx').default;

const AlertStore = require('../../stores/AlertStore.js').default;

function getAlertsState () {
  return AlertStore.getAlerts();
}

const AlertDisplay = React.createClass({
  getInitialState: function() {
    return {
      alerts: getAlertsState()
    }
  },
  updateState: function() {
    this.setState({
      alerts: getAlertsState()
    });
  },
  componentWillMount: function () {
    AlertStore.on("change", this._onChange);
  },
  componentWillUnmount: function () {
    AlertStore.removeListener("change", this._onChange);
  },
  componentDidMount: function () {
    var lastAlert = document.body.querySelector('.alert:last-of-type');
  },
  buildChildren: function (alert) {
    let tone = (alert.tone === undefined) ? 'neutral' : alert.tone;
    return(
      <Alert key={alert.id} id={alert.id} className='alert' message={alert.message} tone={tone} />
    )
  },
  render: function() {
    var alerts = this.state.alerts;
    return(
      <div id='alert-display'>
        <div className='alerts'>{alerts.map(this.buildChildren)}</div>
      </div>
    )
  },
  _onChange: function () {
    this.updateState();
  }
});

export default AlertDisplay;
