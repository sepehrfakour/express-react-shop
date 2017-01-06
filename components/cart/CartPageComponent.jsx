const React = require('react');

import { Link, browserHistory } from 'react-router';

const ItemStore   = require('../../stores/ItemStore.js').default,
      CartStore   = require('../../stores/CartStore.js').default,
      CartActions = require('../../actions/CartActions.js'),
      AlertActions = require('../../actions/AlertActions.js');

function getCartState() {
  return CartStore.getCart();
}

var CartPage = React.createClass({
  getInitialState: function () {
    return {
      items: getCartState(),
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
    return (
      <tr key={cartItem.id} data-id={cartItem.id} className="cart-item">
        <td name="name"><img src={item.imageurl}></img></td>
        <td name="name">{item.name}</td>
        <td name="price">{item.price}</td>
        <td name="quantity">{cartItem.quantity}</td>
        <td>
          <button data-id={cartItem.id} onClick={this._onRemoveHandler}>Remove</button>
        </td>
      </tr>
    )
  },
  render: function () {
    return(
      <div id="cart-page" className="container-fluid content">
        <div className="banner">
          <h1>Cart</h1>
        </div>
        <div className="container items-container">
          <div className="row cart-top">
            <button onClick={this._onKeepShoppingHandler}>Keep shopping</button>
          </div>
          <div className="row">
            <div className="offset-xs-1 col-xs-10 offset-md-0 col-md-6 border-box">
              <table id="cart-table">
                <tbody>
                  {this.state.items.map(this.buildItems)}
                </tbody>
              </table>
            </div>
            <div className="offset-xs-1 col-xs-10 offset-md-0 col-md-6 border-box">
              <div className="cart-summary">
                <button>Continue to checkout</button>
              </div>
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
  }
})

export default CartPage;
