const React = require('react');

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
    // TODO: Don't POST the form...instead use AJAX in data layer handler triggered by Actions
    // TODO: Remove iframe response hack

    return(
      <div id="control-panel">
        <button id="open-panel" onClick={this._togglePanelHandler} className={className}>+ Add Item</button>
        <form method="POST" action="/api/v1/item/create" id="add-item-form" target="resultsFrame" className={className}>
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
            <input type="submit" name="submit" value="+ Add Item" />
          </p>
        </form>
        <iframe id="resultsFrame" name="resultsFrame" onload={this._createCallback}></iframe>
      </div>
    );
  },
  _togglePanelHandler: function () {
    if (this.state.open === false) {
      this.setState({open:true});
    } else {
      this.setState({open:false});
    }
  },
  _createCallback: function () {
    console.log("Iframe loaded callback!");
  }
})

export default ControlPanel;
