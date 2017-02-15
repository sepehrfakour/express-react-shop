import dispatcher from '../dispatcher.js';

export function getCheckout() {
  dispatcher.dispatch({
    type: "GET_CHECKOUT"
  })
}

export function getShipping() {
  dispatcher.dispatch({
    type: "GET_SHIPPING"
  })
}

export function getPayment() {
  dispatcher.dispatch({
    type: "GET_PAYMENT"
  })
}

export function setShipping(data) {
  dispatcher.dispatch({
    type: "SET_SHIPPING",
    data: data
  });
}

export function setPayment(data) {
  dispatcher.dispatch({
    type: "SET_PAYMENT",
    data: data
  });
}

