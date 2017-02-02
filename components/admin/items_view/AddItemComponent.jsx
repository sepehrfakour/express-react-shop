const React = require('react');

const ItemModal = require('./ItemModalComponent.jsx').default;

const ItemActions = require('../../../actions/ItemActions.js');

const AddItem = React.createClass({
  getInitialState: function () {
      return {};
  },
  componentDidMount: function () {},
  render: function () {
    // TODO: Add validation to form
    return (
      <div id="add-item-modal">
        <ItemModal type="add-item-form" submitButtonText="Add Item" submitCallback={this._addItemClickHandler} closeCallback={this.props.closeModal} />
      </div>
    );
  },
  _addItemClickHandler: function (event) {
    event.preventDefault();
    let form          = document.body.querySelector('#add-item-form'),
        formValidated = false,
        data          = {
          // Create a temporary ID until we are returned a real one from DB following AJAX promise resolution in DAO
          tempid:      Math.random()*1000000,
          name:        form.name.value,
          item_group:  form.item_group.value,
          category:    form.category.value,
          price:       parseFloat(parseFloat(form.price.value).toFixed(2)),
          size:        form.size.value.toUpperCase(),
          color:       form.color.value.toLowerCase(),
          description: form.description.value,
          sku:         form.sku.value,
          quantity:    parseInt(form.quantity.value,10),
          imageurl:    form.imageurl.value,
          status:      form.status.value
        };
    if ( data.name
      && data.item_group
      && data.category
      && data.price
      && data.size
      && data.color
      && data.description
      && data.sku
      && data.quantity
      && data.imageurl !== "/images/default.png"
      && data.status ) {
      formValidated = true;
    }
    if (formValidated) {
      ItemActions.addItem(data);
      this.props.closeModal(event);
    } else {
      alert("Please fill out all form fields before submitting");
    }
  }
})

export default AddItem;
