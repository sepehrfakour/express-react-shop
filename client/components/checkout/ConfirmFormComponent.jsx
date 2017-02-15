const React = require('react');

const StripeDAO      = require('../../dao/StripeDAO.js').default,
      AlertActions   = require('../../actions/AlertActions.js'),
      OverlayActions = require('../../actions/OverlayActions.js');

const ConfirmForm = React.createClass({
  getInitialState: function () {
    return {
      processing: false
    };
  },
  componentWillMount: function () {
    window.addEventListener('keydown', this._keyPressHandler)
  },
  componentWillUnmount: function () {
    window.removeEventListener('keydown', this._keyPressHandler)
  },
  render: function () {
    let name = this.props.shipping.customer_first_name + ' ' + this.props.shipping.customer_last_name,
        street = this.props.shipping.shipping_street_1 + ', ' + this.props.shipping.shipping_street_2,
        card = this.props.payment.card.replace(/\D/g,''), // Remove all non-digit characters like trailing spaces
        lastFour = Array(card.length-4).join('•') + card.slice(card.length-4,card.length);
    return(
      <form id="confirm-form" onSubmit={this._submitCallback}>
        <div className="row">
          <span className="col-xs-12">
            <section>Name: <span>{name}</span></section>
            <section>Email: <span>{this.props.shipping.customer_email}</span></section>
            <section>Phone: <span>{this.props.shipping.customer_phone}</span></section>
            <section>Street: <span>{street}</span></section>
            <section>City: <span>{this.props.shipping.shipping_city}</span></section>
            <section>State: <span>{this.props.shipping.shipping_state}</span></section>
            <section>Zip Code: <span>{this.props.shipping.shipping_postal_code}</span></section>
            <section>Card: <span>{lastFour}</span></section>
          </span>
        </div>
        <div className="row">
          <span className="col-xs-12">
            <input type="submit" name="checkout-form-submit" value="Place order" onClick={this._submitCallback} />
            <input type="text" id="stripe-token" onChange={this._onToken} />
          </span>
        </div>
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
    if (this.state.processing) { return false; }
    if (!this.props.cartHasItems) {
      // Make sure this form wont submit unless cart has at least one item in it
      AlertActions.addAlert('You must have at least one item in your cart before you can checkout','neutral');
      return false;
    }
    // Set state to processing to reject any more submissions via click or enter key
    this.setState({processing: true});
    OverlayActions.setOverlay(true); // Activate loading overlay
    StripeDAO.createToken(this.props.payment);
  },
  _onToken: function (event) {
    if (event.target.hasAttribute('data-token')) {
      let token = event.target.getAttribute('data-token');
      StripeDAO.submitOrder(this.props.cart,this.props.shipping,token);
    } else {
      console.warn('Invalid submission');
    }
  }
})

export default ConfirmForm;
