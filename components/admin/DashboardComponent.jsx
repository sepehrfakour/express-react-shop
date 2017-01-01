const React = require('react');

const ControlPanel  = require('./ControlPanelComponent.jsx').default,
      AddItem = require('./AddItemComponent.jsx').default,
      EditItem = require('./EditItemComponent.jsx').default;

const ItemStore   = require('../../stores/ItemStore.js').default,
      ItemActions = require('../../actions/ItemActions.js');

function getItemState() {
  return ItemStore.getItems();
}

var Dashboard = React.createClass({
  getInitialState: function () {
    return {
      items: getItemState(),
      addModalOpen: false,
      editModalOpen: false,
      selectedForEdit: false
    }
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
        <td name="name"><img src={item.imageurl}></img></td>
        <td name="name">{item.name}</td>
        <td name="category">{item.category}</td>
        <td name="price">{item.price}</td>
        <td name="sku">{item.sku}</td>
        <td name="quantity">{item.quantity}</td>
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
        <ControlPanel clickHandler={this._onAddCLick}/>
        <table id="admin-items-list">
          <thead>
            <tr>
              <th>Image</th>
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
        {this.state.addModalOpen ? <AddItem closeModal={this._closeModalsCallback} /> : <span style={{display:'none'}}></span>}
        {this.state.editModalOpen ? <EditItem closeModal={this._closeModalsCallback} item={this.state.selectedForEdit} /> : <span style={{display:'none'}}></span>}
      </div>
    );
  },
  _onChange: function () {
    this.setState({ items: getItemState()});
  },
  _onAddCLick: function (e) {
    this.setState({
      addModalOpen: true,
      editModalOpen: false
    })
  },
  _onEditClick: function (e) {
    let id = parseInt(e.target.getAttribute('data-id'),10);
    let item = ItemStore.getItem(id);
    this.setState({
      addModalOpen: false,
      editModalOpen: true,
      selectedForEdit: item
    })
  },
  _onDeleteClick: function (e) {
    var confirmed = confirm("Are you sure you want to delete this item?");
    if (confirmed) {
      let data= {
        id: parseInt(e.target.getAttribute('data-id'),10)
      }
      ItemActions.deleteItem(data);
    }
  },
  _closeModalsCallback: function (e) {
    e.preventDefault();
    this.setState({
      addModalOpen: false,
      editModalOpen: false,
      selectedForEdit: false
    })
  }
})

export default Dashboard;
