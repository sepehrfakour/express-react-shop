const Store = require('store');

const AlertActions = require('../actions/AlertActions.js');

class CartDAO {
  constructor() {
    this.name = 'shoppingCart'
    this.disabledWarning = 'Some site features may not work correctly when browsing in private mode on Safari or on older browsers. For best experience use regular browsing mode, or a newer browser.';
    // Check to see if Store/localStorage is enabled
    if (Store.enabled) {
      this.enabled = true;
      if (Store.get(this.name) === undefined) {
        // No shopping cart currently initialized in localStorage
        Store.set(this.name,[]);
      }
    } else {
      this.enabled = false;
      // Since we have no local storage available, disable all methods
      // Example use case: Safari / Mobile Safari private browsing
      this.getCart = function () { return []; };
      this.addItemToCart = function () { console.warn(this.disabledWarning); };
      this.removeItemFromCart = function () { console.warn(this.disabledWarning); };
      // Optional alert on true page loads or refreshes
      let msg = this.disabledWarning;
      AlertActions.addAlert(msg,'negative');
    }
  }
  getCart() {
    // If Store is disabled, return empty array
    if (this.enabled) {
      return Store.get(this.name);
    } else {
      return [];
    }
  }
  addItemToCart(data) {
    let cart = Store.get(this.name),
        itemAlreadyInCart = false;
    // Search for an existing instance of this item in shopping cart
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === data.id) {
        // If we find existing item in cart, simply add the new quantity in
        itemAlreadyInCart = true;
        if (data.quantity >= 0) {
          // Add new quantity of items to cart
          cart[i].quantity += data.quantity;
        } else {
          // Cannot add negative quantity of items to cart
          console.warn("Error adding item(s) to cart");
        }
      }
    }
    // If search for existing item instance yields no results, add new item in
    if (!itemAlreadyInCart) {
      cart.push(data);
    }
    Store.set(this.name,cart);
  }
  removeItemFromCart(data) {
    // Removes an item from cart completely, regardless of quantity
    let cart = Store.get(this.name),
        id = parseInt(data,10);
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === id) {
        cart.splice(i,1);
      }
    }
    Store.set(this.name,cart);
  }
  clearCart() {
    // Removes all items from the cart
    if (this.enabled) {
      Store.set(this.name,[]);
    }
  }
}

const cartDAO = new CartDAO;

export default cartDAO;
