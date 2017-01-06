const React = require('react');

const AlertActions = require('../../actions/AlertActions.js');

var Alert = React.createClass({
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
    },1000)
  },
  componentWillUnmount: function () {
    var alert = document.getElementById(this.props.id);
    alert.removeEventListener( 'transitionend', this._onTransitionEnd)
  },
  render: function() {
    let className = 'alert alert-' + this.props.tone;
    return(
      <alert id={this.props.id} className={className}>{this.props.message}</alert>
    )
  },
  _onTransitionEnd: function (element) {
    var alert = document.getElementById(this.props.id);
    // Remove alert from DOM
    AlertActions.removeAlert(this.props.id);
  },
  _onClick: function () {

  }
});

export default Alert;
