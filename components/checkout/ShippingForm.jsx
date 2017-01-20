const React = require('react');

const CheckoutActions = require('../../actions/CheckoutActions.js');

const ShippingForm = React.createClass({
  getInitialState: function () {
    return {};
  },
  componentWillMount: function () {
    window.addEventListener('keydown', this._keyPressHandler)
  },
  componentWillUnmount: function () {
    window.removeEventListener('keydown', this._keyPressHandler)
  },
  render: function () {
    let shipping = this.props.shipping;
    return(
      <form id="shipping-form" onSubmit={this._submitCallback}>
        <p>
          <span>
            <label>First name</label>
            <input type="text" name="customer_first_name" placeholder="First name" defaultValue={shipping.customer_first_name}/>
          </span>
          <span>
            <label>Last name</label>
            <input type="text" name="customer_last_name" placeholder="Last name" defaultValue={shipping.customer_last_name}/>
          </span>
        </p>
        <p>
          <span>
            <label>Email</label>
            <input type="email" name="customer_email" placeholder="Email" defaultValue={shipping.customer_email}/>
          </span>
          <span>
            <label>Phone</label>
            <input type="tel" name="customer_phone" placeholder="Phone" defaultValue={shipping.customer_phone}/>
          </span>
        </p>
        <p>
          <label>Shippping address</label>
          <input type="text" name="shipping_street_1" placeholder="Street 1" defaultValue={shipping.shipping_street_1}/>
          <input type="text" name="shipping_street_2" placeholder="Street 2" defaultValue={shipping.shipping_street_2}/>
        </p>
        <p>
          <span>
            <label>City</label>
            <input type="text" name="shipping_city" placeholder="City" defaultValue={shipping.shipping_city}/>
          </span>
          <span>
            <label>State</label>
            <select name="shipping_state" defaultValue={shipping.shipping_state}>
              <option>Alabama</option><option>Alaska</option><option>Arizona</option><option>Arkansas</option><option>California</option><option>Colorado</option><option>Connecticut</option><option>Delaware</option><option>Florida</option><option>Georgia</option><option>Hawaii</option><option>Idaho</option><option>Illinois</option><option>Indiana</option><option>Iowa</option><option>Kansas</option><option>Kentucky</option><option>Louisiana</option><option>Maine</option><option>Maryland</option><option>Massachusetts</option><option>Michigan</option><option>Minnesota</option><option>Mississippi</option><option>Missouri</option><option>Montana</option><option>Nebraska</option><option>Nevada</option><option>New Hampshire</option><option>New Jersey</option><option>New Mexico</option><option>New York</option><option>North Carolina</option><option>North Dakota</option><option>Ohio</option><option>Oklahoma</option><option>Oregon</option><option>Pennsylvania</option><option>Rhode Island</option><option>South Carolina</option><option>South Dakota</option><option>Tennessee</option><option>Texas</option><option>Utah</option><option>Vermont</option><option>Virginia</option><option>Washington</option><option>West Virginia</option><option>Wisconsin</option><option>Wyoming</option>
            </select>
          </span>
          <span>
            <label>Zipcode</label>
            <input type="text" name="shipping_postal_code" placeholder="Zipcode" defaultValue={shipping.shipping_postal_code}/>
          </span>
        </p>
        <p>
          <input type="submit" name="checkout-form-submit" value="Continue to payment" onClick={this._submitCallback} />
        </p>
      </form>
    );
  },
  _keyPressHandler: function (event) {
    if ((event.which && event.which == 13) || (event.keyCode && event.keyCode == 13)) {
      // Handle enter key
      event.stopPropagation();
      this._submitCallback(event);
    }
  },
  _submitCallback: function (event) {
    event.preventDefault();
    let form          = document.body.querySelector('#shipping-form'),
        formValidated = false,
        data          = {
          customer_first_name: form.customer_first_name.value,
          customer_last_name: form.customer_last_name.value,
          customer_email: form.customer_email.value,
          customer_phone: form.customer_phone.value,
          shipping_street_1: form.shipping_street_1.value,
          shipping_street_2: form.shipping_street_2.value,
          shipping_city: form.shipping_city.value,
          shipping_state: form.shipping_state.value,
          shipping_postal_code: form.shipping_postal_code.value
        };
    if (this._validateForm(data)) {
      CheckoutActions.setShipping(data);
      this.props.submitCallback();
    }
  },
  _validateForm: function (data) {
    // TODO: validate this form!
    return true;
  }
})

export default ShippingForm;
