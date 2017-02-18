import { browserHistory } from 'react-router';

const CartActions = require('../actions/CartActions.js'),
      AlertActions = require('../actions/AlertActions.js'),
      OverlayActions = require('../actions/OverlayActions.js');

class StripeDAO {
  constructor() {
    this.stripeResponseHandler = this.stripeResponseHandler.bind(this);
    this.errorBackToCart       = this.errorBackToCart.bind(this);
  }
  createToken(payment) {
    let that = this;
    if (!window.Stripe) {
      console.warn('Stripe script not loaded');
      that.errorBackToCart();
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
      that.errorBackToCart(response.error.message);
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
        'Content-Type': 'application/json'
      }),
      credentials: 'include'
    });

    fetch(request).then( function (res) {
      return res.text().then(text => {
        return {
          message: text,
          status: res.status
        }
      });
      // return res.text();
    }).then( function(response) {
      let status = response.status;
      if ((status === 402) || (status === 400)) {
        that.errorBackToCart(response.message);
      } else {
        // Empty cart, navigate to home page, display success message
        CartActions.clearCart();
        browserHistory.push('/');
        let msg = "Your order has been placed! You will receive an order confirmation email shortly.";
        OverlayActions.setOverlay(false); // Deactivate loading overlay
        AlertActions.addAlert(msg,'positive');
      }
    });
  }
  errorBackToCart(message) {
    // Navigate to cart and display API/Stripe error message
    browserHistory.push('/cart');
    OverlayActions.setOverlay(false); // Deactivate loading overlay
    if (message) {
      AlertActions.addAlert(message,'negative');
    } else {
      AlertActions.addAlert("Payment could not be processed. Please try again later.",'negative');
    }
  }
}

const stripeDAO = new StripeDAO;

export default stripeDAO;
