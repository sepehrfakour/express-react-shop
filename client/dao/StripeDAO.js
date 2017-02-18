import { browserHistory } from 'react-router';

const CartActions = require('../actions/CartActions.js'),
      AlertActions = require('../actions/AlertActions.js'),
      OverlayActions = require('../actions/OverlayActions.js');

class StripeDAO {
  constructor() {
    this.stripeResponseHandler = this.stripeResponseHandler.bind(this);
    this._errorBackToCart      = this._errorBackToCart.bind(this);
  }
  createToken(payment) {
    let that = this;
    if (!window.Stripe) {
      console.warn('Stripe script not loaded');
      that._errorBackToCart();
    }
    else {
      // Get token
      Stripe.setPublishableKey(window.s_pk);
      Stripe.card.createToken({
        number: payment.card,
        cvc: payment.cvc,
        exp: payment.expiry,
        address_zip: payment.zip
      }, that.stripeResponseHandler);
    }
  }
  stripeResponseHandler(status,response) {
    let that = this;
    if (response.error) {
      console.warn('Error creating Stripe token');
      that._errorBackToCart(response.error.message);
    }
    else {
      let token = response.id,
          input = document.body.querySelector('#stripe-token'),
          event = new Event('input', { bubbles: true });
      input.setAttribute('data-token',token);
      input.dispatchEvent(event);
    }
  }
  submitOrder(cart,shipping,token) {
    let that = this;
    let data = {
      stripeToken: token,
      cart: cart,
      shipping: shipping
    };

    let request = new Request('/api/v1/charge', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: new Headers({
        'Content-Type': 'application/json',
        'X-CSRF-Token': window.csrf_token
      }),
      credentials: 'same-origin'
    });

    fetch(request)
      .then( function (res) {
        return res.text().then(text => {
          return {
            message: text,
            status: res.status
          }
        });
      })
      .then( function(response) {
        (response.status == 200) ? that._handleSuccess() : that._errorBackToCart(response.message,response.status);
      });
  }
  _handleSuccess() {
    CartActions.clearCart(); // Empty cart
    browserHistory.push('/'); // Navigate to home page
    OverlayActions.setOverlay(false); // Deactivate loading overlay
    let msg = "Order received! You will get an order confirmation email shortly.";
    AlertActions.addAlert(msg,'positive'); // Display success message
    mixpanel.track('Payment Success'); // Log event
  }
  _errorBackToCart(message,status) {
    browserHistory.push('/cart'); // Navigate to cart
    OverlayActions.setOverlay(false); // Deactivate loading overlay
    if (message && status !== 403) {
      AlertActions.addAlert(message,'negative'); // Display API/Stripe error message
      mixpanel.track('Payment Failure', {message: message});
    } else { // Either no message, or response status was a 403, implying Stripe script/token error, or invalid CSRF token
      AlertActions.addAlert("Payment could not be processed. Please try again later.",'negative');
      mixpanel.track('Payment Failure', {message: "No message."});
    }
  }
}

const stripeDAO = new StripeDAO;

export default stripeDAO;
