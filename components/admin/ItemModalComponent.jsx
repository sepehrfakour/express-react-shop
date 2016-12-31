const React = require('react');

var ItemModal = React.createClass({
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
    var id = null,
        name = '',
        category = '',
        price = '',
        sku = '',
        quantity = '';
    if (this.props.item) {
      id = this.props.item.id,
      name = this.props.item.name,
      category = this.props.item.category,
      price = this.props.item.price,
      sku = this.props.item.sku,
      quantity = this.props.item.quantity;
    }
    // TODO: Add validation to form
    return(
        <form id={this.props.type} data-id={id} onSubmit={this.props.submitCallback}>
          <h2>{this.props.submitButtonText + " Form"}</h2>
          <button id="close-panel" onClick={this.props.closeCallback}>X</button>
          <p>
            <label>Category:</label>
            <select name="category" placeholder="Category" defaultValue={category}>
              <option value="hats">Hats</option>
              <option value="shirts">Shirts</option>
              <option value="pants">Pants</option>
              <option value="dresses">Dresses</option>
              <option value="other">Other</option>
            </select>
          </p>
          <p>
            <label>Name:</label>
            <input type="text" name="name" placeholder="Name" defaultValue={name}/>
          </p>
          <p>
            <label>Price:</label>
            <input type="number" step="any" name="price" placeholder="Price" defaultValue={price}/>
          </p>
          <p>
            <label>SKU:</label>
            <input type="text" name="sku" placeholder="Sku" defaultValue={sku}/>
          </p>
          <p>
            <label>Quantity:</label>
            <input type="number" name="quantity" placeholder="Quantity" defaultValue={quantity}/>
          </p>
          <p>
            <input type="submit" name="add-item-form-submit" value={this.props.submitButtonText} onClick={this.props.submitCallback} />
          </p>
        </form>
    );
  },
  _keyPressHandler: function (event) {
    console.log('keypress handler triggered');
    if ((event.which && event.which == 13) || (event.keyCode && event.keyCode == 13)) {
      event.stopPropagation();
      this.props.submitCallback(event);
    }
    if ((event.which && event.which == 27) || (event.keyCode && event.keyCode == 27)) {
      event.stopPropagation();
      this.props.closeCallback(event);
    }
  }
})

export default ItemModal;
