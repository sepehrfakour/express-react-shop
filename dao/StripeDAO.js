import { browserHistory } from 'react-router';

const CartActions = require('../actions/CartActions.js'),
      AlertActions = require('../actions/AlertActions.js'),
      OverlayActions = require('../actions/OverlayActions.js');

class StripeDAO {
  constructor() {}
  createToken(payment) {
    if (!window.Stripe) { console.warn('Stripe script not loaded'); }
    else {
      // Get token
      Stripe.setPublishableKey(window.s_pk);
      Stripe.card.createToken({
        number: payment.card,
        cvc: payment.cvc,
        exp_month: payment.expiry.split(/\//)[0],
        exp_year: payment.expiry.split(/\//)[1],
        address_zip: payment.zip
      }, this.stripeResponseHandler);
    }
  }
  stripeResponseHandler(status,response) {
    if (response.error) { console.warn('Error creating Stripe token'); }
    else {
      let token = response.id,
          input = document.body.querySelector('#stripe-token'),
          event = new Event('input', { bubbles: true });
      input.setAttribute('data-token',token);
      input.dispatchEvent(event);
    }
  }
  submitOrder(cart,shipping,token) {
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
      if (response.status === 402) {
        // Navigate to cart and display API/Stripe error message
        browserHistory.push('/cart');
        OverlayActions.setOverlay(false); // Deactivate loading overlay
        AlertActions.addAlert(response.message,'negative');
      } else {
        // Empty cart, navigate to home page, display success message
        CartActions.clearCart();
        browserHistory.push('/');
        let msg = "Hooray! Your order has been placed and you will receive an order confirmation email shortly.";
        OverlayActions.setOverlay(false); // Deactivate loading overlay
        AlertActions.addAlert(msg,'positive');
      }
    });
  }
}

const stripeDAO = new StripeDAO;

export default stripeDAO;
