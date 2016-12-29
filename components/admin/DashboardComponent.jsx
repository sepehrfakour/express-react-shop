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
      <tr key={item.id}>
        <td>{item.name}</td>
        <td>{item.category}</td>
        <td>{item.price}</td>
        <td>{item.sku}</td>
        <td>{item.quantity}</td>
        <td>
          <button data-id={item.id} onClick={this._onEditClick}>Edit</button>
          <button data-id={item.id} onClick={this._onDeleteClick}>Delete</button>
        </td>
      </tr>
    )
  },
  render: function () {
    console.log(this.state.items);
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
    // TODO: Use update item action
    let id = e.target.getAttribute('data-id');
    console.log("Edit click. Item id: ", id);
  },
  _onDeleteClick: function (e) {
    // TODO: Use delete item action
    let id = e.target.getAttribute('data-id');
    console.log("Delete click. Item id: ", id);
  }
})

export default Dashboard;
