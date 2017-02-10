const React = require('react');

const ItemsNav = require('./AdminItemsNavComponent.jsx').default,
      AddItem  = require('./AddItemComponent.jsx').default,
      EditItem = require('./EditItemComponent.jsx').default;

const ItemStore      = require('../../../stores/ItemStore.js').default,
      ItemActions    = require('../../../actions/ItemActions.js'),
      OverlayActions = require('../../../actions/OverlayActions.js');

function getItemState() {
  return ItemStore.getItems();
}

const AdminItemsView = React.createClass({
  getInitialState: function () {
    return {
      items: getItemState(),
      addModalOpen: false,
      editModalOpen: false,
      selectedForEdit: false,
      viewInactive: false
    }
  },
  componentWillMount: function () {
    ItemStore.on("change", this._onChange);
  },
  componentWillUnmount: function () {
    ItemStore.removeListener("change", this._onChange);
  },
  addToItemGroups: function (item) {
    if (!this.itemGroups[item.item_group]) {
      this.itemGroups[item.item_group] = {
        colors: [],
        sizes: []
      };
    }
    if (this.itemGroups[item.item_group].colors.indexOf(item.color) === -1) {
      this.itemGroups[item.item_group].colors.push(item.color);
    }
    if (this.itemGroups[item.item_group].sizes.indexOf(item.size) === -1) {
      this.itemGroups[item.item_group].sizes.push(item.size);
    }
  },
  buildItems: function (item) {
    if ((this.state.viewInactive === false) && (item.status === 'inactive')) {
      return;
    }
    if (!this.rendered[item.item_group]) {
      this.rendered[item.item_group] = true;
      return (
        <tr key={item.id} data-id={item.id}>
          <td name="name"><img src={item.imageurl}></img></td>
          <td name="name">{item.name}</td>
          <td name="item_group">{item.item_group}</td>
          <td name="category">{item.category}</td>
          <td name="price">{item.price}</td>
          <td name="size">{this.itemGroups[item.item_group].sizes.join(', ')}</td>
          <td name="color">{this.itemGroups[item.item_group].colors.join(', ')}</td>
          <td name="description">{item.description}</td>
          <td name="sku">{item.sku}</td>
          <td name="quantity">{item.quantity}</td>
          <td name="status">{item.status}</td>
          <td>
            <button data-id={item.id} onClick={this._onEditClick}>Edit</button>
          </td>
        </tr>
      )
    }
  },
  render: function () {
    this.rendered = {};
    // Find all available colors for each item_group
    this.itemGroups = {};
    this.state.items.map(this.addToItemGroups);
    return(
      <div id="admin-items-view">
        <ItemsNav
          addClickHandler={this._onAddCLick}
          toggleInactiveHandler={this._toggleViewInactiveCallback}
          toggled={this.state.viewInactive}
        />
        <table id="admin-items-list">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Item Group</th>
              <th>Category</th>
              <th>Price</th>
              <th>Size</th>
              <th>Color</th>
              <th>Description</th>
              <th>Sku</th>
              <th>Quantity</th>
              <th>Status</th>
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
    OverlayActions.setOverlay(true);
    this.setState({
      addModalOpen: true,
      editModalOpen: false
    })
  },
  _onEditClick: function (e) {
    OverlayActions.setOverlay(true);
    let id = parseInt(e.target.getAttribute('data-id'),10);
    let item = ItemStore.getItem(id);
    this.setState({
      addModalOpen: false,
      editModalOpen: true,
      selectedForEdit: item
    })
  },
  _closeModalsCallback: function (e) {
    e.preventDefault();
    OverlayActions.setOverlay(false);
    this.setState({
      addModalOpen: false,
      editModalOpen: false,
      selectedForEdit: false
    })
  },
  _toggleViewInactiveCallback: function (e) {
    let viewInactive = (this.state.viewInactive) ? false : true;
    this.setState({
      viewInactive: viewInactive
    })
  }
})

export default AdminItemsView;
