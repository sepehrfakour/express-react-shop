const React = require('react');

const CheckoutActions = require('../../actions/CheckoutActions.js');

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
        <p className="row">
          <span className="col-xs-12">
            <label>Card number</label>
            <input type="text" name="card" placeholder="#### #### #### ####" onChange={this._onCardChangeHandler} defaultValue={payment.card}/>
            <span className="card-type">{cardType}</span>
          </span>
        </p>
        <p className="row">
          <span className="col-xs-12">
            <label>Expiration date</label>
            <input type="text" name="expiry" placeholder="MM/YY" defaultValue={payment.expiry}/>
          </span>
        </p>
        <p className="row">
          <span className="col-xs-12">
            <label>CVC</label>
            <input type="text" name="cvc" placeholder="###" defaultValue={payment.cvc}/>
          </span>
        </p>
        <p className="row">
          <span className="col-xs-12">
            <label>Zipcode</label>
            <input type="text" name="zip" placeholder="#####" defaultValue={payment.zip}/>
          </span>
        </p>
        <p className="row">
          <span className="col-xs-12">
            <input type="submit" name="checkout-form-submit" value="Continue to confirmation" onClick={this._submitCallback} />
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
  _onCardChangeHandler: function (event) {
    let cardType = Stripe.card.cardType(event.target.value);
    this.setState({cardType:cardType});
  },
  _submitCallback: function (event) {
    // TODO: Split expiry into two 2-character input fields
    event.preventDefault();
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
