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
    // TODO: Refactor this listener on ItemStore (maybe call ItemStore on MainWindow and pass items array as props)
    ItemStore.on("change", this._onChange);
    CartStore.on("change", this._onChange);
  },
  componentWillUnmount: function () {
    // TODO: Refactor this listener on ItemStore (maybe call ItemStore on MainWindow and pass items array as props)
    ItemStore.removeListener("change", this._onChange);
    CartStore.removeListener("change", this._onChange);
  },
  buildItems: function (cartItem) {
    // TODO: Refactor current method, which, using ItemStore, matches ids to retreive each Cart item's data etc
    let item = ItemStore.getItem(cartItem.id);
    // Adjust subtotal
    this.subtotal += (parseFloat(item.price,10) * parseInt(cartItem.quantity,10));
    return (
      <tr key={cartItem.id} data-id={cartItem.id} className="cart-item">
        <td name="image"><img src={item.imageurl}></img></td>
        <td name="name">{item.name}</td>
        <td name="price">${item.price}</td>
        <td name="quantity">x{cartItem.quantity}</td>
        <td>
          <button data-id={cartItem.id} onClick={this._onRemoveHandler}>Remove</button>
        </td>
      </tr>
    )
  },
  render: function () {
    this.subtotal = 0.00;
    this.tax_rate = 0.08;
    return(
      <div id="cart-page" className="container-fluid content">
        <div className="banner">
          <h1>Cart</h1>
        </div>
        <div className="container items-container">
          <div className="row cart-top">
            <button onClick={this._onKeepShoppingHandler}>Keep shopping</button>
            <Link to="/checkout">Continue to checkout</Link>
          </div>
          <div className="row">
            <div className="col-xs-12 border-box">
              <table id="cart-table">
                <tbody>
                  {this.state.items.map(this.buildItems)}
                  <tr>
                    <td className="cart-summary" colSpan="5">
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
            <Link to="/checkout">Continue to checkout</Link>
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
  }
})

export default CartPage;
