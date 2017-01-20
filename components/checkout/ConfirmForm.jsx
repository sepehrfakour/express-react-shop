const React = require('react');

const ConfirmForm = React.createClass({
  getInitialState: function () {
    return {};
  },
  componentWillMount: function () {
    window.addEventListener('keydown', this._keyPressHandler)
  },
  componentWillUnmount: function () {
    window.removeEventListener('keydown', this._keyPressHandler)
  },
  render: function () {
    return(
      <form id="confirm-form" onSubmit={this._submitCallback} className="container">
        <p className="row">Click the button to pay and complete your purchase</p>
        <p className="row">
          <span className="col-xs-12">
            <input type="submit" name="checkout-form-submit" value="Complete purchase" onClick={this._submitCallback} />
          </span>
        </p>
      </form>
    );
  },
  _keyPressHandler: function (event) {
    if ((event.which && event.which == 13) || (event.keyCode && event.keyCode == 13)) {
      // Handle enter key
      event.stopPropagation();
      this._submitCallback(event);
    }
  },
  _submitCallback: function (event) {
    event.preventDefault();
  }
})

export default ConfirmForm;
