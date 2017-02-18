const React = require('react');

import { Link, browserHistory } from 'react-router';

const ItemStore   = require('../../stores/ItemStore.js').default,
      CartStore   = require('../../stores/CartStore.js').default,
      CartActions = require('../../actions/CartActions.js'),
      AlertActions = require('../../actions/AlertActions.js');

function getCartState() {
  return CartStore.getCart();
}

const CartPage = React.createClass({
  getInitialState: function () {
    return {
      items: getCartState()
    };
  },
  componentWillMount: function () {
    // ItemStore listener necessary to display item info on browser page refresh)
    ItemStore.on("change", this._onChange);
    CartStore.on("change", this._onChange);
  },
  componentWillUnmount: function () {
    ItemStore.removeListener("change", this._onChange);
    CartStore.removeListener("change", this._onChange);
  },
  buildItems: function (cartItem) {
    let item = ItemStore.getItem(cartItem.id);
    // Adjust subtotal
    this.subtotal += (parseFloat(item.price,10) * parseInt(cartItem.quantity,10));
    return (
      <tr key={cartItem.id} data-id={cartItem.id} className="cart-item">
        <td name="image"><img src={item.imageurl}></img></td>
        <td name="name">{item.name}</td>
        <td name="color">{item.color}</td>
        <td name="size">{item.size}</td>
        <td name="price">${item.price}</td>
        <td name="quantity">x{cartItem.quantity}</td>
        <td>
          <button data-id={cartItem.id} onClick={this._onRemoveHandler}>X</button>
        </td>
      </tr>
    )
  },
  render: function () {
    let cartHasItems = (this.state.items.length > 0) ? true : false,
        checkoutLinkClassName = (cartHasItems) ? "" : "disabled" ;
    this.subtotal = 0.00;
    this.tax_rate = 0.08;
    return(
      <div id="cart-page" className="container-fluid content">
        <div className="container items-container cart-container">
          <div className="row cart-top">
            <button onClick={this._onKeepShoppingHandler}>Keep shopping</button>
            <Link to="/checkout" className={checkoutLinkClassName} onClick={this._onCheckoutClickHandler}>Continue to checkout</Link>
          </div>
          <div className="row">
            <div className="col-xs-12 col-lg-10 offset-lg-1 col-xl-8 offset-xl-2 border-box">
              <table id="cart-table">
                <tbody>
                  {
                    (cartHasItems) ? this.state.items.map(this.buildItems) : <tr><td>— Cart empty —</td></tr>
                  }
                  <tr>
                    <td className="cart-summary" colSpan="7">
                      <p>
                        <span>Subtotal: </span>
                        <span>${this.subtotal.toFixed(2)}</span>
                      </p>
                      <p>
                        <span>Tax: </span>
                        <span>${(this.subtotal * this.tax_rate).toFixed(2)}</span>
                      </p>
                      <p>
                        <span>Total: </span>
                        <span>${(this.subtotal + (this.subtotal * this.tax_rate)).toFixed(2)}</span>
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="row cart-bottom">
            <div className="col-xs-12 col-lg-10 offset-lg-1 col-xl-8 offset-xl-2 border-box">
              <Link to="/checkout" className={checkoutLinkClassName} onClick={this._onCheckoutClickHandler}>Continue to checkout</Link>
            </div>
          </div>
        </div>
      </div>
    );
  },
  _onChange: function () {
    this.setState({ items: getCartState()});
  },
  _onRemoveHandler: function (event) {
    let id = event.target.getAttribute('data-id');
    CartActions.removeItem(id);
    AlertActions.addAlert('Item removed from cart','neutral');
  },
  _onKeepShoppingHandler: function () {
    browserHistory.goBack();
  },
  _onCheckoutClickHandler: function (event) {
    event.preventDefault();
    if (this.state.items.length > 0) {
      browserHistory.push('/checkout');
    } else {
      AlertActions.addAlert('You must have at least one item in your cart before you can checkout','neutral');
    }
  }
})

export default CartPage;
