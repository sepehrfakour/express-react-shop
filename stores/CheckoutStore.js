import { EventEmitter } from "events";

import dispatcher from "../dispatcher.js";

class CheckoutStore extends EventEmitter {
  constructor() {
    super();
    this.checkout = {
      shipping: {
        customer_first_name: '',
        customer_last_name: '',
        customer_email: '',
        customer_phone: '',
        shipping_street_1: '',
        shipping_street_2: '',
        shipping_city: '',
        shipping_state: '',
        shipping_postal_code: '',
      },
      payment: {
        card: '',
        expiry: '',
        cvc: ''
      }
    };
  }
  getCheckout() {
    return this.checkout;
  }
  getShipping() {
    return this.checkout.shipping;
  }
  getPayment() {
    return this.checkout.payment;
  }
  setShipping(data) {
    this.checkout.shipping = data;
    this.emit("change");
  }
  setPayment(data) {
    this.checkout.payment = data;
    this.emit("change");
  }
  handleActions(action) {
    console.log("CheckoutStore received an action:", action);
    switch(action.type) {
      case "GET_CHECKOUT": {
        this.getCheckout();
        break;
      }
      case "GET_SHIPPING": {
        this.getShipping();
        break;
      }
      case "GET_PAYMENT": {
        this.getPayment();
        break;
      }
      case "SET_SHIPPING": {
        this.setShipping(action.data);
        break;
      }
      case "SET_PAYMENT": {
        this.setPayment(action.data);
        break;
      }
      default: {
        break;
      }
    }
  }
}

const checkoutStore = new CheckoutStore;
dispatcher.register(checkoutStore.handleActions.bind(checkoutStore));

export default checkoutStore;
