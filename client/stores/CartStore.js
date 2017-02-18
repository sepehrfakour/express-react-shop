import { EventEmitter } from "events";

import dispatcher from "../dispatcher.js";

const CartDAO = require('../dao/CartDAO.js').default;

class CartStore extends EventEmitter {
  constructor() {
    super();
    // Retreive cart from local storage if available
    this.cart = CartDAO.getCart();
    // this.cart = [
    //   {
    //     id: 72,
    //     quantity: 2
    //   },
    //   {
    //     id: 40,
    //     quantity: 1
    //   },
    // ];
  }
  getCart() {
    return this.cart;
  }
  getCartItemCount() {
    return this.cart.reduce( function (prev,curr) {
      return prev + curr.quantity;
    },0);
  }
  addItem(data) {
    let cart = this.cart,
        item = {
          id:        data.id,
          quantity:  data.quantity
        },
        itemAlreadyInCart = false;

    // Search for an existing instance of this item in shopping cart
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === item.id) {
        // If we find existing item in cart, simply add the new quantity in
        itemAlreadyInCart = true;
        if (item.quantity >= 0) {
          // Add new quantity of items to cart
          cart[i].quantity += item.quantity;
        } else {
          // Cannot add negative quantity of items to cart
          console.warn("Error adding item(s) to cart");
        }
      }
    }
    // If search for existing item instance yields no results, add new item in
    if (!itemAlreadyInCart) {
      cart.push(item);
    }
    this.cart = cart;
    this.emit("change");
  }
  removeItem(data) {
    // If an item exists in cart, removes it completely, regardless of quantity
    let cart = this.cart,
        id = parseInt(data,10);
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === id) {
        cart.splice(i,1);
      }
    }
    this.cart = cart;
    this.emit("change");
  }
  clearCart() {
    this.cart = [];
    this.emit("change");
  }
  handleActions(action) {
    console.log("CartStore received an action:", action);
    switch(action.type) {
      case "GET_CART": {
        this.getCart();
        break;
      }
      case "ADD_ITEM_TO_CART": {
        this.addItem(action.data);
        break;
      }
      case "REMOVE_ITEM_FROM_CART": {
        this.removeItem(action.data);
        break;
      }
      case "CLEAR_CART": {
        this.clearCart();
        break;
      }
      default: {
        break;
      }
    }
  }
}

const cartStore = new CartStore;
dispatcher.register(cartStore.handleActions.bind(cartStore));

export default cartStore;
