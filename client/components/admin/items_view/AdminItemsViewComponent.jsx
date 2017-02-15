const React = require('react');

const ItemsNav  = require('./AdminItemsNavComponent.jsx').default,
      ItemGroup = require('./ItemGroupModalComponent.jsx').default,
      AddItem   = require('./AddItemComponent.jsx').default,
      EditItem  = require('./EditItemComponent.jsx').default;

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
      itemGroupModalOpen: false,
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
        <tr key={item.id} data-id={item.id} data-item-group={item.item_group} onClick={this._onItemGroupClick}>
          <td name="image"><img src={item.imageurl}></img></td>
          <td name="name">{item.name}</td>
          <td name="category">{item.category}</td>
          <td name="price">{item.price}</td>
          <td name="size">{this.itemGroups[item.item_group].sizes.join(', ')}</td>
          <td name="color">{this.itemGroups[item.item_group].colors.join(', ')}</td>
          <td name="quantity">{item.quantity}</td>
          <td name="status">{item.status}</td>
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
          toggleInactiveHandler={this._toggleInactiveCallback}
          toggled={this.state.viewInactive}
        />
        <table id="admin-items-list">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Sizes</th>
              <th>Colors</th>
              <th>Quantity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {this.state.items.map(this.buildItems)}
          </tbody>
        </table>
        {this.state.itemGroupModalOpen ? <ItemGroup closeModal={this._closeModalsCallback} items={this.state.selectedForEdit} editClickHandler={this._onEditClick}/> : <span style={{display:'none'}}></span>}
        {this.state.addModalOpen ? <AddItem closeModal={this._closeModalsCallback} /> : <span style={{display:'none'}}></span>}
        {this.state.editModalOpen ? <EditItem closeModal={this._closeModalsCallback} item={this.state.selectedForEdit} /> : <span style={{display:'none'}}></span>}
      </div>
    );
  },
  _onChange: function () {
    this.setState({ items: getItemState()});
  },
  _onItemGroupClick: function (e) {
    let target = (e.target.nodeName === "TR") ? e.target : e.target.parentElement,
        item_group = target.getAttribute('data-item-group'),
        items = ItemStore.getItemsByItemGroup(item_group);
    OverlayActions.setOverlay(true);
    window.scrollTo(0, 0);
    this.setState({
      itemGroupModalOpen: true,
      addModalOpen: false,
      editModalOpen: false,
      selectedForEdit: items
    })
  },
  _onAddCLick: function (e) {
    OverlayActions.setOverlay(true);
    window.scrollTo(0, 0);
    this.setState({
      itemGroupModalOpen: false,
      addModalOpen: true,
      editModalOpen: false
    })
  },
  _onEditClick: function (e) {
    let target = (e.target.nodeName === "TR") ? e.target : e.target.parentElement,
        id     = parseInt(target.getAttribute('data-id'),10),
        item   = ItemStore.getItem(id);
    OverlayActions.setOverlay(true);
    window.scrollTo(0, 0);
    this.setState({
      itemGroupModalOpen: false,
      addModalOpen: false,
      editModalOpen: true,
      selectedForEdit: item
    })
  },
  _closeModalsCallback: function (e) {
    e.preventDefault();
    OverlayActions.setOverlay(false);
    this.setState({
      itemGroupModalOpen: false,
      addModalOpen: false,
      editModalOpen: false,
      selectedForEdit: false
    })
  },
  _toggleInactiveCallback: function (e) {
    let viewInactive = (this.state.viewInactive) ? false : true;
    this.setState({
      viewInactive: viewInactive
    })
  }
})

export default AdminItemsView;
