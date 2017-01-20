const React = require('react');

const ItemStore     = require('../../stores/ItemStore.js').default,
      CartStore     = require('../../stores/CartStore.js').default,
      CheckoutStore = require('../../stores/CheckoutStore.js').default;

const ShippingForm = require('./ShippingForm.jsx').default,
      PaymentForm  = require('./PaymentForm.jsx').default,
      ConfirmForm  = require('./ConfirmForm.jsx').default;

function getCartState() {
  return CartStore.getCart();
}
function getShippingState () {
  return CheckoutStore.getShipping();
}
function getPaymentState () {
  return CheckoutStore.getPayment();
}

const CheckoutPage = React.createClass({
  getInitialState: function () {
    return {
      items: getCartState(),
      shipping: getShippingState(),
      payment: getPaymentState(),
      currentForm: 'shipping'
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
      <tr key={cartItem.id} data-id={cartItem.id} className="checkout-item">
        <td name="image"><img src={item.imageurl}></img></td>
        <td name="name">{item.name}</td>
        <td name="price">{item.price}</td>
        <td name="quantity">{cartItem.quantity}</td>
      </tr>
    );
  },
  buildForm: function () {
    if (this.state.currentForm === 'confirm') {
      return ( <ConfirmForm /> );
    } else if (this.state.currentForm === 'payment') {
      return ( <PaymentForm payment={this.state.payment} submitCallback={this._paymentFormCompleteCallback}/> );
    } else {
      return ( <ShippingForm shipping={this.state.shipping} submitCallback={this._shippingFormCompleteCallback}/> );
    }
  },
  render: function () {
    let progressClassName = 'progress-' + this.state.currentForm;
    return(
      <div id="checkout-page" className="container-fluid content">
        <div className="banner">
          <h1>Checkout</h1>
        </div>
        <div className="container items-container">
          <div className="row">
            <div className="col-xs-12 border-box">
              <div id="checkout-progress" className={progressClassName}>
                <section>Shipping</section>
                <section>Payment</section>
                <section>Confirm</section>
              </div>
              {this.buildForm()}
              <table id="checkout-table">
                <tbody>
                  {this.state.items.map(this.buildItems)}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  },
  _onChange: function () {
    this.setState({
      items: getCartState(),
      shipping: getShippingState()
    });
  },
  _shippingFormCompleteCallback: function () {
    this.setState({
      currentForm: 'payment'
    })
  },
  _paymentFormCompleteCallback: function () {
    this.setState({
      currentForm: 'confirm'
    })
  }
})

export default CheckoutPage;
