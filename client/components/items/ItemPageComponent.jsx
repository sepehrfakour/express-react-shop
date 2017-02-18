const React = require('react');

import { browserHistory } from 'react-router';

const ItemStore    = require('../../stores/ItemStore.js').default,
      ItemActions  = require('../../actions/ItemActions.js'),
      CartActions  = require('../../actions/CartActions.js'),
      AlertActions = require('../../actions/AlertActions.js');

function getItemState (item_group) {
  return ItemStore.getValidItemsByItemGroup(item_group);
}

const ItemPage = React.createClass({
  getInitialState: function () {
    return {
      items: getItemState(this.props.params.item_group),
      firstItem: false,
      selectedColor: false,
      selectedSize: false,
      selectedQuantity: 1
    };
  },
  componentWillMount: function () {
    window.addEventListener('keydown', this._keyPressHandler)
    ItemStore.on("change", this._onChange);
  },
  componentDidMount: function () {
    // Force a change event to setState for firstItem, selectedColor, and selectedSize
    this._onChange();
  },
  componentWillUnmount: function () {
    window.removeEventListener('keydown', this._keyPressHandler)
    ItemStore.removeListener("change", this._onChange);
  },
  getAllColors: function () {
    let colors = [];
    this.state.items.map( function (item) {
      if (colors.indexOf(item.color) === -1) { colors.push(item.color); }
    });
    return colors;
  },
  getSizesByColor: function (color) {
    return this.state.items.filter( function (item) {
      return (item.color === color);
    })
    .map( function (item) {
      return item.size;
    });
  },
  getValidItemQuantities: function (color,size) {
    let validQuantities = [];
    // Filter the items array for one unique item of the given size and color
    let selectedItem = this.state.items.filter( function (item) {
      return (item.color === color) && (item.size === size);
    })[0];
    if (!selectedItem) { return []; }; // No item exists of this color/size combo; exit early
    let quantity = selectedItem.quantity;
    if (quantity >= 10) { return [1,2,3,4,5,6,7,8,9,10]; }; // Item quantity 10+; exit early
    // Populate an array of valid quantity choices for <select> input
    for (var i = 1; i <= quantity; i++) {
      validQuantities.push(i);
    };
    return validQuantities;
  },
  buildColorInputs: function (color) {
    let className = 'color-' + color,
        key       = 'color-key-' + color,
        id        = 'color-id-' + color,
        checked   = (color === this.state.selectedColor) ? true : false;
    return (
      <span key={key}>
        <input type="radio" name="color" id={id} value={color} className={className} defaultChecked={checked} onChange={this._onColorChangeHandler}/>
        <label htmlFor={id}></label>
      </span>
    )
  },
  buildSizeInputs: function (size) {
    return (
      <option key={'size-key-'+size} value={size}>{size}</option>
    )
  },
  buildQuantityInputs: function (quantity) {
    return (
      <option key={'quantity-key-'+quantity} value={quantity}>{quantity}</option>
    )
  },
  render: function () {
    if (!this.state.firstItem) { // No items yet. Render out-of-stock message.
      return (
        <div id="item-page" className="container-fluid content">
          <div className="item-name">
            <h2>This item is currently out of stock.</h2>
          </div>
        </div>
      );
    };
    let firstItem       = this.state.firstItem,
        name            = firstItem.name,
        price           = firstItem.price,
        imageurl        = firstItem.imageurl,
        description     = firstItem.description,
        colors          = this.getAllColors(),
        selectedColor   = this.state.selectedColor,
        selectedSize    = this.state.selectedSize,
        validSizes      = this.getSizesByColor(selectedColor),
        validQuantities = (selectedColor && selectedSize)
                            ? this.getValidItemQuantities(selectedColor, selectedSize)
                            : this.getValidItemQuantities(selectedColor, validSizes[0]);
    return(
      <div id="item-page" className="container-fluid content">
        <div className="item-name">
          <h2>{name}</h2>
        </div>
        <div className="container item-container">
          <div className="row">
            <div className="offset-xs-1 col-xs-10 offset-md-0 col-md-6 border-box">
              <div className="item-image">
                <img src={imageurl}/>
              </div>
            </div>
            <div className="offset-xs-1 col-xs-10 offset-md-0 col-md-6 border-box">
              <form className="item-info">
                <h4>{name}</h4>
                <div>${price}</div>
                <p>
                  { colors.map(this.buildColorInputs) }
                </p>
                <p className="item-size-and-quantity">
                  <span>
                    <label>Size</label>
                    <select name="size" value={this.state.selectedSize} onChange={this._onSizeChangeHandler}>
                      { validSizes.map(this.buildSizeInputs) }
                    </select>
                  </span>
                  <span>
                    <label>Quantity</label>
                    <select id="item-quantity-selector" name="quantity" value={this.state.selectedQuantity} onChange={this._onQuantityChangeHandler}>
                      { validQuantities.map(this.buildQuantityInputs) }
                    </select>
                  </span>
                </p>
                <button onClick={this._addToCartHandler}>Add to bag</button>
                <div className="item-description">{description}</div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  },
  _onChange: function () {
    let items         = getItemState(this.props.params.item_group),
        firstItem     = (items.length > 0) ? items[0] : false,
        selectedColor = (firstItem) ? firstItem.color : false,
        selectedSize  = (firstItem) ? firstItem.size : false;
    this.setState({
      items: getItemState(this.props.params.item_group),
      firstItem: firstItem,
      selectedColor: selectedColor,
      selectedSize: selectedSize
    });
  },
  _onColorChangeHandler: function () {
    let form = document.body.querySelector('.item-info'),
        color = form.color.value;
    this.setState({
      selectedColor: color,
      selectedSize: false,
      selectedQuantity: 1
    });
  },
  _onSizeChangeHandler: function () {
    let form = document.body.querySelector('.item-info'),
        size = form.size.value;
    this.setState({
      selectedSize: size,
      selectedQuantity: 1
    });
  },
  _onQuantityChangeHandler: function () {
    let quantity = parseInt(document.body.querySelector('#item-quantity-selector').value, 10);
    this.setState({ selectedQuantity: quantity });
  },
  _addToCartHandler: function (event) {
    event.preventDefault();
    // Based on the selected color and size, find the correct item from the item_group
    let color    = this.state.selectedColor,
        size     = this.state.selectedSize,
        quantity = this.state.selectedQuantity || 1;
    // First make sure both a size and a color are selected
    if (!color || !size) {
      console.warn('Both color and size must be selected first');
      AlertActions.addAlert('Please select a size and a color.','neutral');
      return false;
    }
    // Get the selected item by size and color
    let selectedItem = this.state.items.filter(function(item) {
      return (item.color === color && item.size === size);
    })[0];
    // Make sure a valid item exists
    if (selectedItem === undefined) {
      // If there is no item from this item_group that matches the selected color and size, display Alert
      console.warn('No stock left for selected item');
      AlertActions.addAlert('Oops! Sorry, we are out of the selected size/color.','negative');
      return false;
    }
    let item = {
      id: selectedItem.id,
      quantity: quantity
    }
    CartActions.addItem(item);
    let msg = selectedItem.name + ' added to cart';
    AlertActions.addAlert(msg,'neutral');
    browserHistory.push('/cart');
  },
  _keyPressHandler: function (event) {
    if ((event.which && event.which == 13) || (event.keyCode && event.keyCode == 13)) {
      // Handle enter key
      event.stopPropagation();
      this._addToCartHandler(event);
    }
  }
})

export default ItemPage;
