const React = require('react');

const ItemModal = require('./ItemModalComponent.jsx').default;

const ItemActions = require('../../actions/ItemActions.js');

const EditItem = React.createClass({
  getInitialState: function () {
      return {};
  },
  componentDidMount: function () {},
  render: function () {
    // TODO: Add validation to form
    return (
      <div id="edit-item-modal">
        <ItemModal type="edit-item-form" submitButtonText="Edit Item" submitCallback={this._editItemClickHandler} closeCallback={this.props.closeModal} item={this.props.item} />
      </div>
    )
  },
  _editItemClickHandler: function (event) {
    event.preventDefault();
    let form          = document.body.querySelector('#edit-item-form'),
        formValidated = false,
        data          = {
          id:       this.props.item.id,
          name:     form.name.value,
          category: form.category.value,
          price:    parseInt(form.price.value, 10),
          sku:      form.sku.value,
          quantity: parseInt(form.quantity.value,10),
          imageurl: form.imageurl.value
        };
    if ( form.name.value !== ""
      && form.category.value !== ""
      && form.price.value !== ""
      && form.sku.value !== ""
      && form.quantity.value !== ""
      && form.imageurl.value !== "/images/default.png" ) {
      formValidated = true;
    }
    if (formValidated) {
      ItemActions.updateItem(data);
      this.props.closeModal(event);
    } else {
      alert("Please fill out all form fields before submitting");
    }
  }
})

export default EditItem;
