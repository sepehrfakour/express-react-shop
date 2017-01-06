const React = require('react');

import { browserHistory } from 'react-router';

const ItemStore    = require('../../stores/ItemStore.js').default,
      ItemActions  = require('../../actions/ItemActions.js'),
      CartActions  = require('../../actions/CartActions.js'),
      AlertActions = require('../../actions/AlertActions.js');

function getItemState (id) {
  return ItemStore.getItem(id);
}

var ItemPage = React.createClass({
  getInitialState: function () {
    return {
      item: getItemState(parseInt(this.props.params.id,10)),
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
  render: function () {
    return(
      <div id="item-page" className="container-fluid content">
        <div className="item-name">
          <h2>{this.state.item.name}</h2>
        </div>
        <div className="container item-container">
          <div className="row">
            <div className="offset-xs-1 col-xs-10 offset-md-0 col-md-6 border-box">
              <div className="item-image">
                <img src={this.state.item.imageurl}/>
              </div>
            </div>
            <div className="offset-xs-1 col-xs-10 offset-md-0 col-md-6 border-box">
              <form className="item-info">
                <h4>{this.state.item.name}</h4>
                <div>${this.state.item.price}</div>
                <p>
                  <label>Color</label>
                  <input type="radio" name="color" value="white"/>
                  <input type="radio" name="color" value="grey"/>
                  <input type="radio" name="color" value="black"/>
                </p>
                <p>
                  <label>Size</label>
                  <select name="size">
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                  </select>
                </p>
                <p>
                  <label>Quantity</label>
                  <select id="item-quantity-selector" name="quantity" onChange={this._onQuantityChangeHandler}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                  </select>
                </p>
                <button onClick={this._addToCartHandler}>Add to bag</button>
                <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  },
  _onChange: function () {
    this.setState({ item: getItemState(parseInt(this.props.params.id,10))});
  },
  _onQuantityChangeHandler: function () {
    let quantity = parseInt(document.body.querySelector('#item-quantity-selector').value, 10);
    this.setState({ selectedQuantity: quantity });
  },
  _addToCartHandler: function (event) {
    event.preventDefault();
    let item = {
      id: this.state.item.id,
      quantity: this.state.selectedQuantity
    }
    CartActions.addItem(item);
    let msg = this.state.item.name + ' added to cart';
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
