const React = require('react');

const ItemModal = require('./ItemModalComponent.jsx').default;

const ItemActions = require('../../../actions/ItemActions.js');

const EditItem = React.createClass({
  getInitialState: function () {
      return {};
  },
  componentDidMount: function () {},
  render: function () {
    return (
      <div id="edit-item-modal">
        <ItemModal type="edit-item-form" submitButtonText="Edit Item" submitCallback={this._editItemClickHandler} closeCallback={this.props.closeModal} item={this.props.item} />
      </div>
    )
  },
  _editItemClickHandler: function (event) {
    event.preventDefault();
    let form          = document.body.querySelector('#edit-item-form'),
        data          = {
          id:          this.props.item.id,
          name:        form.name.value,
          item_group:  form.name.value.toLowerCase().split(" ").join("_"),
          category:    form.category.value,
          price:       parseFloat(parseFloat(form.price.value).toFixed(2)),
          size:        form.size.value.toUpperCase(),
          color:       form.color.value.toLowerCase(),
          description: form.description.value,
          sku:         "no_sku",
          quantity:    parseInt(form.quantity.value,10),
          imageurl:    form.imageurl.value,
          status:      form.status.value
        };
    let formIsValid = this._validateForm(data);
    if (formIsValid) {
      ItemActions.updateItem(data);
      this.props.closeModal(event);
    } else {
      alert("Please fill out all form fields before submitting");
    }
  },
  _validateForm: function (data) {
    let items = this.props.items,
        valid = false;
    if ( data.name
      && data.item_group
      && data.category
      && data.price
      && data.size
      && data.color
      && data.description
      && data.sku
      && data.quantity
      && data.imageurl !== '/img/shoppingCartIcon.png'
      && data.status ) {
      valid = true;
    }
    return valid;
  }
})

export default EditItem;
