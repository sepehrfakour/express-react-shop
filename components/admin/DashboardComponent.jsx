const React = require('react');

const ControlPanel = require('./ControlPanelComponent.jsx').default;

const ItemStore   = require('../../stores/ItemStore.js').default,
      ItemActions = require('../../actions/ItemActions.js');

function getItemState() {
  return {
    items: ItemStore.getItems()
  };
}

var Dashboard = React.createClass({
  getInitialState: function () {
    return getItemState();
  },
  componentWillMount: function () {
    ItemStore.on("change", this._onChange);
  },
  componentWillUnmount: function () {
    ItemStore.removeListener("change", this._onChange);
  },
  buildItems: function (item) {
    return (
      <tr key={item.id} data-id={item.id}>
        <td data-name={item.name}>{item.name}</td>
        <td data-category={item.category}>{item.category}</td>
        <td data-price={item.price}>{item.price}</td>
        <td data-sku={item.sku}>{item.sku}</td>
        <td data-quantity={item.quantity}>{item.quantity}</td>
        <td>
          <button data-id={item.id} onClick={this._onEditClick}>Edit</button>
          <button data-id={item.id} onClick={this._onDeleteClick}>Delete</button>
        </td>
      </tr>
    )
  },
  render: function () {
    return(
      <div id="admin-dashboard">
        <h1>Admin Dashboard</h1>
        <div id="admin-controls">
          <ControlPanel />
        </div>
        <table id="admin-items-list">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Sku</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.state.items.map(this.buildItems)}
          </tbody>
        </table>
      </div>
    );
  },
  _onChange: function () {
    this.setState(getItemState());
  },
  _onEditClick: function (e) {
    let id = parseInt(e.target.getAttribute('data-id'),10),
        row = document.body.querySelector('tr[data-id="'+id+'"]') || e.target.parentElement.parentElement;
    if (row) {
      let data= {
        id: id,
        category: "tempCat",
        name: "tempName",
        price: 1000,
        sku: "tempSku",
        quantity: 1
      }
      ItemActions.updateItem(data);
    }
  },
  _onDeleteClick: function (e) {
    var confirmed = confirm("Are you sure you want to delete this item?");
    if (confirmed) {
      let data= {
        id: parseInt(e.target.getAttribute('data-id'),10)
      }
      ItemActions.deleteItem(data);
    }
  }
})

export default Dashboard;
