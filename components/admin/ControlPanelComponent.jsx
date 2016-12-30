const React = require('react');

const ItemActions = require('../../actions/ItemActions.js');

var ControlPanel = React.createClass({
  getInitialState: function () {
      return {
        open: false
      };
  },
  componentDidMount: function () {},
  render: function () {
    if (this.state.open) {
      var className = "open";
    }
    // TODO: Add validation to form
    return(
      <div id="control-panel">
        <button id="open-panel" onClick={this._togglePanelHandler} className={className}>+ Add Item</button>
        <form id="add-item-form" className={className} onSubmit={this._addItemClickHandler}>
          <p>
            <button id="close-panel" onClick={this._togglePanelHandler}>X</button>
          </p>
          <p>
            <select name="category" placeholder="Category">
              <option value="hats">Hats</option>
              <option value="shirts">Shirts</option>
              <option value="pants">Pants</option>
              <option value="dresses">Dresses</option>
              <option value="other">Other</option>
            </select>
          </p>
          <p>
            <input type="text" name="name" placeholder="Name"/>
          </p>
          <p>
            <input type="number" step="any" name="price" placeholder="Price"/>
          </p>
          <p>
            <input type="text" name="sku" placeholder="Sku"/>
          </p>
          <p>
            <input type="number" name="quantity" placeholder="Quantity"/>
          </p>
          <p>
            <input type="submit" name="add-item-form-submit" value="+ Add Item" onClick={this._addItemClickHandler} />
          </p>
        </form>
      </div>
    );
  },
  _togglePanelHandler: function (e) {
    e.preventDefault();
    if (this.state.open === false) {
      this.setState({open:true});
    } else {
      this.setState({open:false});
    }
  },
  _addItemClickHandler: function (event) {
    event.preventDefault();
    let form          = document.body.querySelector('#add-item-form'),
        formValidated = false,
        data          = {
          // Create a temporary ID until we are returned a real one from DB following AJAX promise resolution in DAO
          tempid:   Math.random()*1000000,
          name:     form.name.value,
          category: form.category.value,
          price:    parseInt(form.price.value, 10),
          sku:      form.sku.value,
          quantity: parseInt(form.quantity.value,10)
        };
    if ( form.name.value !== ""
      && form.category.value !== ""
      && form.price.value !== ""
      && form.sku.value !== ""
      && form.quantity.value !== "" ) {
      formValidated = true;
    }
    if (formValidated) {
      ItemActions.addItem(data);
    } else {
      alert("Please fill out the form before submitting");
    }
  }
})

export default ControlPanel;
