const React = require('react');

const ItemStore     = require('../../stores/ItemStore.js').default,
      CartStore     = require('../../stores/CartStore.js').default,
      CheckoutStore = require('../../stores/CheckoutStore.js').default;

const ShippingForm = require('./ShippingFormComponent.jsx').default,
      PaymentForm  = require('./PaymentFormComponent.jsx').default,
      ConfirmForm  = require('./ConfirmFormComponent.jsx').default;

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
    // TODO: Refactor this listener on ItemStore (Necessary to display item info on browser page refresh)
    // (maybe make singular call to ItemStore on MainWindow and pass items array as props)
    ItemStore.on("change", this._onChange);
    CartStore.on("change", this._onChange);
    CheckoutStore.on("change", this._onChange);
  },
  componentWillUpdate: function () {
    window.scrollTo(0, 0);
  },
  componentWillUnmount: function () {
    // TODO: Refactor this listener on ItemStore (Necessary to display item info on browser page refresh)
    // (maybe make singular call to ItemStore on MainWindow and pass items array as props)
    ItemStore.removeListener("change", this._onChange);
    CartStore.removeListener("change", this._onChange);
    CheckoutStore.removeListener("change", this._onChange);
  },
  buildItems: function (cartItem) {
    // TODO: Refactor current method, which, using ItemStore, matches ids to retreive each Cart item's data etc
    let item = ItemStore.getItem(cartItem.id);
    // Adjust subtotal
    this.subtotal += (parseFloat(item.price,10) * parseInt(cartItem.quantity,10));
    return (
      <tr key={cartItem.id} data-id={cartItem.id} className="checkout-item">
        <td name="image"><img src={item.imageurl}></img></td>
        <td name="name">{item.name}</td>
        <td name="price">${item.price}</td>
        <td name="quantity">x{cartItem.quantity}</td>
      </tr>
    );
  },
  buildForm: function () {
    if (this.state.currentForm === 'confirm') {
      return ( <ConfirmForm cartHasItems={this.cartHasItems} cart={this.state.items} shipping={this.state.shipping} payment={this.state.payment} /> );
    } else if (this.state.currentForm === 'payment') {
      return ( <PaymentForm cartHasItems={this.cartHasItems} payment={this.state.payment} submitCallback={this._paymentFormCompleteCallback}/> );
    } else {
      return ( <ShippingForm cartHasItems={this.cartHasItems} shipping={this.state.shipping} submitCallback={this._shippingFormCompleteCallback}/> );
    }
  },
  render: function () {
    // Initialize amount variables
    this.subtotal = 0.00;
    this.tax_rate = 0.08;
    // Initialize boolean flag to ensure at least one item in cart
    this.cartHasItems = (this.state.items.length > 0) ? true : false ;
    let progressClassName = 'row progress-' + this.state.currentForm;
    return(
      <div id="checkout-page" className="container-fluid content">
        <div className="container items-container checkout-container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2 col-xl-6 offset-xl-3 border-box">
              <div id="checkout-progress" className={progressClassName}>
                <section className="col-xs-4">Shipping</section>
                <section className="col-xs-4">Billing</section>
                <section className="col-xs-4">Confirm</section>
              </div>
              {this.buildForm()}
              <div className="checkout-summary">
                <h2>Order Summary:</h2>
                <table id="checkout-table">
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
          </div>
        </div>
      </div>
    );
  },
  _onChange: function () {
    this.setState({
      items: getCartState(),
      shipping: getShippingState(),
      payment: getPaymentState()
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
