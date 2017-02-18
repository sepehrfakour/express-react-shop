const React = require('react');

const AlertActions = require('../../actions/AlertActions.js');

const Alert = React.createClass({
  getInitialState: function() {
    return {}
  },
  componentDidMount: function () {
    var id = this.props.id,
        tone = this.props.tone;
    var alert = document.getElementById(id);
    alert.addEventListener( 'transitionend', this._onTransitionEnd);
    setTimeout(function () {
      alert.className = 'alert rendered alert-' + tone;
    },1000);
  },
  componentWillUnmount: function () {
    var alert = document.getElementById(this.props.id);
    alert.removeEventListener( 'transitionend', this._onTransitionEnd);
  },
  formatMessage: function (message) {
    return message
            .split(/\n\n/g)
            .map( function (row,i,arr) {
              if (arr.length === 1) { return <p key={i}>{row}</p> }
              return <p key={i} className="alert-li">{row}</p>
            });
  },
  render: function() {
    let message = this.formatMessage(this.props.message);
    let className = 'alert alert-' + this.props.tone;
    return(
      <alert id={this.props.id} className={className}>{message}</alert>
    )
  },
  _onTransitionEnd: function (element) {
    // Remove alert from DOM
    AlertActions.removeAlert(this.props.id);
  },
  _onClick: function () {

  }
});

export default Alert;
