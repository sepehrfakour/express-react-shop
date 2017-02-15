const React = require('react');

import { browserHistory } from 'react-router';

const ItemStore    = require('../../stores/ItemStore.js').default,
      ItemActions  = require('../../actions/ItemActions.js'),
      CartActions  = require('../../actions/CartActions.js'),
      AlertActions = require('../../actions/AlertActions.js');

function getItemState (item_group) {
  return ItemStore.getItemsByItemGroup(item_group);
}

const ItemPage = React.createClass({
  getInitialState: function () {
    return {
      items: getItemState(this.props.params.item_group),
      selectedColor: 1,
      selectedSize: 1,
      selectedQuantity: 1
    };
  },
  componentWillMount: function () {
    window.addEventListener('keydown', this._keyPressHandler)
    ItemStore.on("change", this._onChange);
  },
  componentWillUnmount: function () {
    window.removeEventListener('keydown', this._keyPressHandler)
    ItemStore.removeListener("change", this._onChange);
  },
  getAllColors: function () {
    let colors = [];
    this.state.items.map( function (item) {
      if (colors.indexOf(item.color) === -1) { colors.push(item.color); }
    })
    return colors;
  },
  getAllSizes: function () {
    let sizes = [];
    this.state.items.map( function (item) {
      if (sizes.indexOf(item.size) === -1) { sizes.push(item.size); }
    })
    return sizes;
  },
  buildColorInputs: function (color) {
    this.colorCount++;
    let className = 'color-' + color,
        key       = 'color-key-' + color,
        id        = 'color-id-' + color,
        checked   = (this.colorCount > 1) ? false : true;
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
    let name, price, imageurl, description;
    if (this.state.items[0]) {
      name = this.state.items[0].name,
      price = this.state.items[0].price,
      imageurl = this.state.items[0].imageurl,
      description = this.state.items[0].description;
    }
    this.colorCount = 0;
    this.colors = this.getAllColors();
    this.sizes = this.getAllSizes();
    this.quantity = [];
    this.maxQuantity = 10;
    for (var i = 0; i < this.maxQuantity; i++) {
      this.quantity[i] = i+1;
    };
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
                  { this.colors.map(this.buildColorInputs) }
                </p>
                <p className="item-size-and-quantity">
                  <span>
                    <label>Size</label>
                    <select name="size" onChange={this._onSizeChangeHandler}>
                      { this.sizes.map(this.buildSizeInputs) }
                    </select>
                  </span>
                  <span>
                    <label>Quantity</label>
                    <select id="item-quantity-selector" name="quantity" onChange={this._onQuantityChangeHandler}>
                      { this.quantity.map(this.buildQuantityInputs) }
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
    this.setState({ items: getItemState(this.props.params.item_group) });
  },
  _onColorChangeHandler: function () {
    let form = document.body.querySelector('.item-info'),
        color = form.color.value;
    this.setState({ selectedColor: color });
  },
  _onSizeChangeHandler: function () {
    let form = document.body.querySelector('.item-info'),
        size = form.size.value;
    this.setState({ selectedSize: size });
  },
  _onQuantityChangeHandler: function () {
    let quantity = parseInt(document.body.querySelector('#item-quantity-selector').value, 10);
    this.setState({ selectedQuantity: quantity });
  },
  _addToCartHandler: function (event) {
    event.preventDefault();
    // Based on the selected color and size, find the correct item from the item_group
    // Make sure to handle default cases where this.state.color and/or this.state.size are equal to 1
    let color = (this.state.selectedColor === 1) ? this.state.items[0].color : this.state.selectedColor;
    let size = (this.state.selectedSize === 1) ? this.state.items[0].size : this.state.selectedSize;
    let selectedItem = this.state.items.filter(function(item) {
      if (item.color === color && item.size === size) { return item; }
    })
    if (selectedItem[0] === undefined) {
      // If there is no item from this item_group that matches the selected color and size, display Alert
      console.warn('No stock left for selected item');
      AlertActions.addAlert('Oops! Sorry, we are out of the selected size/color.','negative');
      return false;
    }
    let item = {
      id: selectedItem[0].id,
      quantity: this.state.selectedQuantity
    }
    CartActions.addItem(item);
    let msg = selectedItem[0].name + ' added to cart';
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
