const React = require('react');

const CheckoutActions = require('../../actions/CheckoutActions.js'),
      AlertActions = require('../../actions/AlertActions.js');

const PaymentForm = React.createClass({
  getInitialState: function () {
    return {
      cardType: 'Unknown'
    };
  },
  componentWillMount: function () {
    window.addEventListener('keydown', this._keyPressHandler)
    // Load Stripe library once only
    if (document.querySelector('#stripe-script') === null) {
      console.log('Loading Stripe')
      let stripeSrc = 'https://js.stripe.com/v2/';
      let script = document.createElement('script');
      script.src = stripeSrc;
      script.id = 'stripe-script';
      document.head.appendChild(script);
    }
  },
  componentWillUnmount: function () {
    window.removeEventListener('keydown', this._keyPressHandler)
  },
  render: function () {
    let payment = this.props.payment;
    let cardType = (this.state.cardType === 'Unknown') ? '' : this.state.cardType;
    return(
      <form id="payment-form" onSubmit={this._submitCallback}>
        <div className="row">
          <span className="col-xs-12">
            <label>Card number</label>
            <input type="text" name="card" placeholder="#### #### #### ####" pattern="\d*" onKeyDown={this._numericKeyPressHandler} onChange={this._onCardChangeHandler} defaultValue={payment.card}/>
            <span className="card-type">{cardType}</span>
          </span>
        </div>
        <div className="row">
          <span className="col-xs-4">
            <label>Expiration</label>
            <input type="text" name="expiry" placeholder="MM/YY" defaultValue={payment.expiry}/>
          </span>
          <span className="col-xs-4">
            <label>CVC</label>
            <input type="text" name="cvc" placeholder="###" pattern="\d*" onKeyDown={this._numericKeyPressHandler} defaultValue={payment.cvc}/>
          </span>
          <span className="col-xs-4">
            <label>Zipcode</label>
            <input type="text" name="zip" placeholder="#####" defaultValue={payment.zip}/>
          </span>
        </div>
        <div className="row secure-stripe">
          <span className="col-xs-12">
            <i className="icon-lock"></i>
            <span>Payments securely processed with <a href="https://www.stripe.com" target="_blank">Stripe</a></span>
          </span>
        </div>
        <div className="row">
          <span className="col-xs-12">
            <input type="submit" name="checkout-form-submit" value="Continue to confirmation" onClick={this._submitCallback} />
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
  _numericKeyPressHandler: function (event) {
    // Allow numbers, backspace, tab, enter, control/command, esc, space, left, up, right, down, delete, c, v, mac command (91/224)
    if ( (event.which && event.which >= 48 && event.which <= 57) ||
         (event.keyCode && event.keyCode >= 48 && event.keyCode <= 57) ||
         (event.which && [8,9,13,17,27,32,37,38,39,40,46,67,86,91,224].indexOf(event.which) !== -1) ||
         (event.keyCode && [8,9,13,17,27,32,37,38,39,40,46,67,86,91,224].indexOf(event.keyCode) !== -1) ) {
      return;
    } else {
      event.preventDefault();
    }
  },
  _onCardChangeHandler: function (event) {
    let cardType = Stripe.card.cardType(event.target.value);
    this.setState({cardType:cardType});
  },
  _submitCallback: function (event) {
    // TODO: Split expiry into two 2-character input fields
    event.preventDefault();
    if (!this.props.cartHasItems) {
      // Make sure this form wont submit unless cart has at least one item in it
      AlertActions.addAlert('You must have at least one item in your cart before you can checkout','neutral');
      return false;
    }
    let form          = document.body.querySelector('#payment-form'),
        formValidated = false,
        data          = {
          card: form.card.value,
          expiry: form.expiry.value,
          cvc: form.cvc.value,
          zip: form.zip.value
        };
    if (this._validateForm(form, data)) {
      CheckoutActions.setPayment(data);
      this.props.submitCallback();
    }
  },
  _validateForm: function (form, data) {
    let cardValid   = Stripe.card.validateCardNumber(data.card),
        expiryValid = Stripe.card.validateExpiry(data.expiry),
        cvcValid    = Stripe.card.validateCVC(data.cvc),
        zipValid    = (data.zip) ? true : false,
        cardType    = Stripe.card.cardType(data.card);

    form.card.className   = (cardValid)   ? '' : 'form-field-error';
    form.expiry.className = (expiryValid) ? '' : 'form-field-error';
    form.cvc.className    = (cvcValid)    ? '' : 'form-field-error';
    form.zip.className    = (zipValid)    ? '' : 'form-field-error';

    this.setState({cardType:cardType});

    if (cardValid && expiryValid && cvcValid && zipValid) {
      return true;
    }
    return false;
  }
})

export default PaymentForm;
