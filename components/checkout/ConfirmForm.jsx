const React = require('react');

const StripeDAO = require('../../dao/StripeDAO.js').default;

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
      <form id="confirm-form" onSubmit={this._submitCallback}>
        <p className="row">Click the button to pay and complete your purchase</p>
        <p className="row">
          <span className="col-xs-12">
            <input type="submit" name="checkout-form-submit" value="Complete purchase" onClick={this._submitCallback} />
            <input type="text" id="stripe-token" onChange={this._onToken} />
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
    StripeDAO.createToken(this.props.payment);
  },
  _onToken: function (event) {
    if (event.target.hasAttribute('data-token')) {
      let token = event.target.getAttribute('data-token');
      StripeDAO.submitOrder(this.props.cart,this.props.shipping,token)
    } else {
      console.warn('Invalid submission');
    }
  }
})

export default ConfirmForm;
