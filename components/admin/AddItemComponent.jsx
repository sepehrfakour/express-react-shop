const React = require('react');

const ItemModal = require('./ItemModalComponent.jsx').default;

const ItemActions = require('../../actions/ItemActions.js');

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
          price:       parseInt(form.price.value, 10),
          size:        form.size.value,
          color:       form.color.value,
          description: form.description.value,
          sku:         form.sku.value,
          quantity:    parseInt(form.quantity.value,10),
          imageurl:    form.imageurl.value,
          status:      form.status.value
        };
    if ( form.name.value !== ""
      && form.item_group.value !== ""
      && form.category.value !== ""
      && form.price.value !== ""
      && form.size.value !== ""
      && form.color.value !== ""
      && form.description.value !== ""
      && form.sku.value !== ""
      && form.quantity.value !== ""
      && form.imageurl.value !== "/images/default.png"
      && form.status.value !== "" ) {
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
