import dispatcher from '../dispatcher.js';

const CartDAO = require('../dao/CartDAO.js').default;

export function getCart() {
  dispatcher.dispatch({
    type: "GET_CART"
  })
}

export function addItem(data) {
  dispatcher.dispatch({
    type: "ADD_ITEM_TO_CART",
    data: data
  });
  CartDAO.addItemToCart(data);
}

export function removeItem(data) {
  dispatcher.dispatch({
    type: "REMOVE_ITEM_FROM_CART",
    data: data
  })
  CartDAO.removeItemFromCart(data);
}
