const React = require('react');

const CheckoutActions = require('../../actions/CheckoutActions.js'),
      AlertActions = require('../../actions/AlertActions.js');

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
    let submitButtonClassName = (this.props.cartHasItems) ? '' : 'disabled';
    return(
      <form id="shipping-form" onSubmit={this._submitCallback}>
        <p className="row">
          <span className="col-xs-12 col-md-6">
            <label>First name</label>
            <input type="text" name="customer_first_name" placeholder="First name" defaultValue={shipping.customer_first_name}/>
          </span>
          <span className="col-xs-12 col-md-6">
            <label>Last name</label>
            <input type="text" name="customer_last_name" placeholder="Last name" defaultValue={shipping.customer_last_name}/>
          </span>
        </p>
        <p className="row">
          <span className="col-xs-12 col-md-8">
            <label>Email</label>
            <input type="email" name="customer_email" placeholder="Email" defaultValue={shipping.customer_email}/>
          </span>
          <span className="col-xs-12 col-md-4">
            <label>Phone</label>
            <input type="tel" name="customer_phone" placeholder="Phone" defaultValue={shipping.customer_phone}/>
          </span>
        </p>
        <p className="row">
          <span className="col-xs-12">
            <label>Shippping address</label>
            <input type="text" name="shipping_street_1" placeholder="Street 1" defaultValue={shipping.shipping_street_1}/>
          </span>
          <span className="col-xs-12" />
          <span className="col-xs-12">
            <input type="text" name="shipping_street_2" placeholder="Street 2" defaultValue={shipping.shipping_street_2}/>
          </span>
        </p>
        <p className="row">
          <span className="col-xs-12 col-md-5">
            <label>City</label>
            <input type="text" name="shipping_city" placeholder="City" defaultValue={shipping.shipping_city}/>
          </span>
          <span className="col-xs-12 col-md-4">
            <label>State</label>
            <select name="shipping_state" defaultValue={shipping.shipping_state}>
              <option>Alabama</option><option>Alaska</option><option>Arizona</option><option>Arkansas</option><option>California</option><option>Colorado</option><option>Connecticut</option><option>Delaware</option><option>Florida</option><option>Georgia</option><option>Hawaii</option><option>Idaho</option><option>Illinois</option><option>Indiana</option><option>Iowa</option><option>Kansas</option><option>Kentucky</option><option>Louisiana</option><option>Maine</option><option>Maryland</option><option>Massachusetts</option><option>Michigan</option><option>Minnesota</option><option>Mississippi</option><option>Missouri</option><option>Montana</option><option>Nebraska</option><option>Nevada</option><option>New Hampshire</option><option>New Jersey</option><option>New Mexico</option><option>New York</option><option>North Carolina</option><option>North Dakota</option><option>Ohio</option><option>Oklahoma</option><option>Oregon</option><option>Pennsylvania</option><option>Rhode Island</option><option>South Carolina</option><option>South Dakota</option><option>Tennessee</option><option>Texas</option><option>Utah</option><option>Vermont</option><option>Virginia</option><option>Washington</option><option>West Virginia</option><option>Wisconsin</option><option>Wyoming</option>
            </select>
          </span>
          <span className="col-xs-12 col-md-3">
            <label>Zipcode</label>
            <input type="text" name="shipping_postal_code" placeholder="Zipcode" defaultValue={shipping.shipping_postal_code}/>
          </span>
        </p>
        <p className="row">
          <span className="col-xs-12">
            <input type="submit" name="checkout-form-submit" className={submitButtonClassName} value="Continue to billing" onClick={this._submitCallback} />
          </span>
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
    if (!this.props.cartHasItems) {
      // Make sure this form wont submit unless cart has at least one item in it
      AlertActions.addAlert('You must have at least one item in your cart before you can checkout','neutral');
      return false;
    }
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
    if (this._validateForm(form)) {
      CheckoutActions.setShipping(data);
      this.props.submitCallback();
    }
  },
  _validateForm: function (form) {
    // Validate that all shipping form fields have content
    let has_customer_first_name = (form.customer_first_name.value !== ''),
        has_customer_last_name = (form.customer_last_name.value !== ''),
        has_customer_email = (form.customer_email.value !== ''),
        has_customer_phone = (form.customer_phone.value !== ''),
        has_shipping_street_1 = (form.shipping_street_1.value !== ''),
        has_shipping_city = (form.shipping_city.value !== ''),
        has_shipping_state = (form.shipping_state.value !== ''),
        has_shipping_postal_code = (form.shipping_postal_code.value !== '');
    // Set form input error CSS classNames if invalid (should eventually use component state for this)
    form.customer_first_name.className  = !has_customer_first_name  ? 'form-field-error' : '';
    form.customer_last_name.className   = !has_customer_last_name   ? 'form-field-error' : '';
    form.customer_email.className       = !has_customer_email       ? 'form-field-error' : '';
    form.customer_phone.className       = !has_customer_phone       ? 'form-field-error' : '';
    form.shipping_street_1.className    = !has_shipping_street_1    ? 'form-field-error' : '';
    form.shipping_city.className        = !has_shipping_city        ? 'form-field-error' : '';
    form.shipping_state.className       = !has_shipping_state       ? 'form-field-error' : '';
    form.shipping_postal_code.className = !has_shipping_postal_code ? 'form-field-error' : '';
    // Email address validation regex from https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address
    let email_address_regex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    form.customer_email.className = (email_address_regex.test(form.customer_email.value)) ? '' : 'form-field-error';
    // If validations pass, return true, else return false
    if ( has_customer_first_name
      && has_customer_last_name
      && has_customer_email
      && has_customer_phone
      && has_shipping_street_1
      && has_shipping_city
      && has_shipping_state
      && has_shipping_postal_code
      && email_address_regex.test(form.customer_email.value) ) {
      return true;
    }
    return false;
  }
})

export default ShippingForm;
